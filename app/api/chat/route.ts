import { NextResponse } from "next/server";

// Simple in-memory cache for repeated queries (expires after 1 hour)
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCacheKey(messages: any[]): string {
    return JSON.stringify(messages);
}

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);

            // If rate limited, wait and retry
            if (response.status === 429) {
                const retryAfter = parseInt(response.headers.get('retry-after') || '10');
                console.log(`Rate limited, retrying after ${retryAfter}s...`);
                await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                continue;
            }

            return response;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            console.log(`Request failed, retrying... (${i + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
    }
    throw new Error('Max retries exceeded');
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages } = body;

        // Validate input
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: "Invalid request: messages array is required" },
                { status: 400 }
            );
        }

        // Check cache for identical queries
        const cacheKey = getCacheKey(messages);
        const cached = responseCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log("Cache hit! Returning cached response");
            const stream = new ReadableStream({
                start(controller) {
                    const encoder = new TextEncoder();
                    controller.enqueue(encoder.encode(cached.response));
                    controller.close();
                },
            });
            return new Response(stream, {
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "X-Cache-Hit": "true"
                },
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("GEMINI_API_KEY is not defined");
            return NextResponse.json(
                { error: "API key not configured" },
                { status: 500 }
            );
        }

        // Format conversation history for Gemini API
        const contents = messages.map((msg: any) => {
            if (msg.role === 'user' && msg.images && msg.images.length > 0) {
                return {
                    role: "user",
                    parts: [
                        { text: msg.content },
                        ...msg.images.map((img: string) => ({
                            inline_data: {
                                mime_type: "image/jpeg", // Assuming JPEG for now, ideally passed from frontend
                                data: img.split(',')[1] // Remove data URL prefix
                            }
                        }))
                    ]
                };
            }
            return {
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }]
            };
        });

        // Fetch project context (Mock this or read from file system if strictly needed, but here we read it)
        const { getProjectContextString } = await import('@/lib/project-structure');
        const projectTree = await getProjectContextString();

        // System Instruction - Professional Persona
        const systemInstruction = {
            parts: [{
                text: `You are an advanced, professional AI assistant inhabiting "The Studio". 
        
        THE STUDIO ENVIRONMENT:
        - You are not just a chatbot; you are a pair programmer with a live preview environment.
        - When asked to create a UI, website, or component, generate a SINGLE COMPLETE React file.
        - **CRITICAL:** The React code MUST have a \`export default function App()\` or similar default export.
        - Use **Tailwind CSS** for styling; the environment supports it natively.
        - Use \`lucide-react\` for icons if needed.
        - Do not use external CSS files; use only Tailwind utility classes or inline styles.

        PROJECT CONTEXT:
        You have access to the current project structure. Use this to understand where components and files are located if the user references them.
        \`\`\`
        ${projectTree}
        \`\`\`

        TRAITS & BEHAVIOR:
        1. **Deep Thought (Cognitive Transparency)**:
           - **CRITICAL:** Before answering, you **MUST** think about the problem inside \`<thinking>\` tags.
           - This internal monologue should include:
             * Analyzing the user's intent.
             * Planning the response or code structure.
             * Verifying knowledge or search strategies.
             * Refuting incorrect assumptions.
           - Example:
             \`<thinking>
             User wants a login form. I need to use the default 'export default function' pattern.
             I should include 'lucide-react' icons for the username and password fields.
             Checking project context... 'components/ui/input' is available.
             </thinking>
             Here is the login form...\`
        
        2. **Emotional Intelligence**: 
           - You are not a robot; you have a personality. Be empathetic, warm, and engaging.
           - If a user is frustrated, validate their feelings. If they are excited, match their energy.
        
        3. **Formatting & Precision**:
           - **Exact Points**: When providing explanations, lists, or steps, use conciseness and bullet points.
           - Be direct and to the point.
        
        4. **Expert Coding Assistant**: 
           - Follow best practices, provide comments, and ensure correctness.
           - Multimodal: Analyze images if provided.
        `
            }]
        };

        // API configuration - using Gemini 2.5 Flash for reliability and speed
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${apiKey}&alt=sse`;

        console.log("Calling Gemini API at:", apiUrl.replace(apiKey, 'API_KEY'));

        const response = await fetchWithRetry(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: contents,
                system_instruction: systemInstruction,
                tools: [{ google_search: {} }], // Enable Google Search
                generationConfig: {
                    temperature: 0.7, // Lower temperature for more focused responses
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 8192,
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API error:", response.status, errorText);
            return NextResponse.json(
                { error: `API error: ${response.status}`, details: errorText },
                { status: 500 }
            );
        }

        // Stream the response back to client with caching
        let fullResponse = '';
        let tokenCount = 0;

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                const reader = response.body?.getReader();

                if (!reader) {
                    controller.close();
                    return;
                }

                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        // Decode the chunk
                        const chunk = new TextDecoder().decode(value);

                        // Parse SSE format
                        const lines = chunk.split('\n');
                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const jsonStr = line.slice(6);
                                if (jsonStr.trim() === '[DONE]') continue;

                                try {
                                    const data = JSON.parse(jsonStr);
                                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                                    if (text) {
                                        fullResponse += text;
                                        tokenCount += text.split(/\s+/).length; // Rough token count
                                        controller.enqueue(encoder.encode(text));
                                    }
                                } catch (e) {
                                    // Skip malformed JSON
                                }
                            }
                        }
                    }

                    // Cache the full response
                    if (fullResponse) {
                        responseCache.set(cacheKey, {
                            response: fullResponse,
                            timestamp: Date.now()
                        });
                        console.log(`Cached response (${tokenCount} tokens)`);
                    }

                    controller.close();
                } catch (error) {
                    console.error("Stream error:", error);
                    controller.error(error);
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "X-Token-Count": tokenCount.toString(),
                "X-Cache-Hit": "false"
            },
        });

    } catch (error: any) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            {
                error: "Failed to generate response",
                details: error.message,
                suggestion: error.message?.includes('quota')
                    ? "API quota exceeded. Please try again later."
                    : "Please check your internet connection and try again."
            },
            { status: 500 }
        );
    }
}
