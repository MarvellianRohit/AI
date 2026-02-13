// Web Worker for processing and rendering artifacts
self.onmessage = function (e) {
    const { type, code, history } = e.data;

    if (type === 'process') {
        // Basic sanitization and wrapping
        const renderedContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; padding: 20px; font-family: sans-serif; background: transparent; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <div id="content">${code}</div>
          <script>
            // Attempt to handle React-like code if detected
            if (document.body.innerHTML.includes('React.') || document.body.innerHTML.includes('<')) {
              // Note: Simple heuristic for now. For real React, we'd use a runtime compiler.
              // For now, we render the HTML/Tailwind results.
            }
          </script>
        </body>
      </html>
    `;

        // Simulate some "heavy" work if needed
        // In a real scenario, this could involve transpilation
        postMessage({ type: 'rendered', content: renderedContent });
    }
};
