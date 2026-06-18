const vscode = require('vscode');

function activate(context) {
    console.log('Extension "interactive-code-visualizer" is now active!');

    let disposable = vscode.commands.registerCommand('interactive-code-visualizer.start', function () {
        const panel = vscode.window.createWebviewPanel(
            'codeVisualizer',
            'Interactive Code Visualizer',
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        // Standard dynamic production HTML pipeline
        panel.webview.html = getWebviewContent(context, panel.webview);

        // Crash-proof Message Bridge listener setup
        panel.webview.onDidReceiveMessage(
            message => {
                if (message.command === 'highlightCode' && message.loc) {
                    const editor = vscode.window.activeTextEditor;
                    if (editor) {
                        const startLine = Math.max(0, message.loc.start.line - 1);
                        const startChar = message.loc.start.column;
                        const endLine = Math.max(0, message.loc.end.line - 1);
                        const endChar = message.loc.end.column;

                        const startPosition = new vscode.Position(startLine, startChar);
                        const endPosition = new vscode.Position(endLine, endChar);
                        
                        editor.selection = new vscode.Selection(startPosition, endPosition);
                        editor.revealRange(
                            new vscode.Range(startPosition, endPosition), 
                            vscode.TextEditorRevealType.InCenter
                        );
                    }
                }
            },
            undefined,
            context.subscriptions
        );

        // Core listener to track code selection changes dynamically
        const selectionDisposable = vscode.window.onDidChangeTextEditorSelection(event => {
            if (event.textEditor === vscode.window.activeTextEditor) {
                const selection = event.selections[0];
                const text = event.textEditor.document.getText(selection);
                if (text && text.trim().length > 5) {
                    panel.webview.postMessage({
                        command: 'updateCode',
                        code: text
                    });
                }
            }
        });

        panel.onDidDispose(() => {
            selectionDisposable.dispose();
        }, null, context.subscriptions);
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent(context, webview) {
    const path = require('path');
    const fs = require('fs');

    // Resolve built React manifest mapping inside production container
    const frontendPath = path.join(context.extensionPath, 'frontend', 'build');
    
    try {
        const manifest = JSON.parse(fs.readFileSync(path.join(frontendPath, 'asset-manifest.json'), 'utf8'));
        const mainJs = manifest.files['main.js'];
        const mainCss = manifest.files['main.css'];

        const jsUri = webview.asWebviewUri(vscode.Uri.file(path.join(frontendPath, mainJs)));
        const cssUri = webview.asWebviewUri(vscode.Uri.file(path.join(frontendPath, mainCss)));

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="${cssUri}">
            <title>Visualizer Engine</title>
        </head>
        <body>
            <div id="root"></div>
            <script src="${jsUri}"></script>
        </body>
        </html>`;
    } catch (err) {
        // Fallback context validation structure if bundle path errors out temporarily
        return `<!DOCTYPE html><html><body><h3>Bundle compilation target missing. Run npm run build in frontend.</h3></body></html>`;
    }
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};