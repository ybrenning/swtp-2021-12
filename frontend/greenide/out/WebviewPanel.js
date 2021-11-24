"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebviewPanel = void 0;
const vscode = require("vscode");
const getNonce_1 = require("./getNonce");
class WebviewPanel {
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        // Set the webview's initial html content
        this._update();
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // // Handle messages from the webview
        // this._panel.webview.onDidReceiveMessage(
        //   (message) => {
        //     switch (message.command) {
        //       case "alert":
        //         vscode.window.showErrorMessage(message.text);
        //         return;
        //     }
        //   },
        //   null,
        //   this._disposables
        // );
    }
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        // If we already have a panel, show it.
        if (WebviewPanel.currentPanel) {
            WebviewPanel.currentPanel._panel.reveal(column);
            WebviewPanel.currentPanel._update();
            return;
        }
        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(WebviewPanel.viewType, "GreenIDE", column || vscode.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,
            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [
                vscode.Uri.joinPath(extensionUri, "media"),
                vscode.Uri.joinPath(extensionUri, "out/compiled"),
            ],
        });
        WebviewPanel.currentPanel = new WebviewPanel(panel, extensionUri);
    }
    static kill() {
        WebviewPanel.currentPanel?.dispose();
        WebviewPanel.currentPanel = undefined;
    }
    static revive(panel, extensionUri) {
        WebviewPanel.currentPanel = new WebviewPanel(panel, extensionUri);
    }
    dispose() {
        WebviewPanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    async _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
        webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case "onInfo": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showInformationMessage(data.value);
                    break;
                }
                case "onError": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
            }
        });
    }
    _getHtmlForWebview(webview) {
        // Use a nonce to only allow specific scripts to be run
        const nonce = (0, getNonce_1.getNonce)();
        const stylesPathMainPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css');
        const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);
        return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<!--
			Use a content security policy to only allow loading images from https or from our extension directory,
			and only allow scripts that have a specific nonce.
      -->
      <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="${stylesMainUri}" rel="stylesheet">
      <script nonce="${nonce}">
      </script>
		</head>
    <body>
    <h1>Welcome to GreenIDE</h1>
    <button> Rerun </button> <button> Compare </button>
		</body>
		</html>`;
    }
}
exports.WebviewPanel = WebviewPanel;
WebviewPanel.viewType = "green-ide";
//# sourceMappingURL=WebviewPanel.js.map