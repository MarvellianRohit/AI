// Analytics tracking utility
export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
    timestamp: number;
    tokenCount?: number;
}

export interface AnalyticsData {
    totalChats: number;
    totalTokens: number;
    totalMessages: number;
    averageResponseTime: number;
    chatHistory: ChatMessage[];
}

export class Analytics {
    private static readonly STORAGE_KEY = 'nexus_analytics';

    static getData(): AnalyticsData {
        if (typeof window === 'undefined') {
            return this.getDefaultData();
        }

        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : this.getDefaultData();
        } catch {
            return this.getDefaultData();
        }
    }

    static saveData(data: AnalyticsData): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    static trackMessage(message: ChatMessage): void {
        const data = this.getData();
        data.chatHistory.push(message);
        data.totalMessages++;
        if (message.tokenCount) {
            data.totalTokens += message.tokenCount;
        }
        this.saveData(data);
    }

    static trackNewChat(): void {
        const data = this.getData();
        data.totalChats++;
        this.saveData(data);
    }

    private static getDefaultData(): AnalyticsData {
        return {
            totalChats: 0,
            totalTokens: 0,
            totalMessages: 0,
            averageResponseTime: 1.2,
            chatHistory: []
        };
    }
}
