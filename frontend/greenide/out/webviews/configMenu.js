"use strict";
// Webview Panel to work with configurations
// - select config and apply as current config
// - save favorites
// - works with JSON to save configs (0 default/current, 1+ saved configs)
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigMenu = void 0;
const vscode = require("vscode");
const getNonce_1 = require("../getNonce");
class ConfigMenu {
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        // Set the webview's initial HTML content
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
        // If we already have a panel, show it
        if (ConfigMenu.currentPanel) {
            ConfigMenu.currentPanel._panel.reveal(column);
            ConfigMenu.currentPanel._update();
            return;
        }
        // Otherwise, create a new panel
        const panel = vscode.window.createWebviewPanel(ConfigMenu.viewType, "GreenIDE", column || vscode.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,
            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [
                vscode.Uri.joinPath(extensionUri, "media"),
                vscode.Uri.joinPath(extensionUri, "out/compiled"),
            ],
        });
        ConfigMenu.currentPanel = new ConfigMenu(panel, extensionUri);
    }
    static kill() {
        ConfigMenu.currentPanel?.dispose();
        ConfigMenu.currentPanel = undefined;
    }
    static revive(panel, extensionUri) {
        ConfigMenu.currentPanel = new ConfigMenu(panel, extensionUri);
    }
    dispose() {
        ConfigMenu.currentPanel = undefined;
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
        // Get path of css file to be used within the Webview's HTML
        const stylesPathMainPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css');
        const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);
        // Return HTML to be rendered within the Webview
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
    
    <h1> Welcome to GreenIDE. </h1>

    <figure>
      <p> <strong> Energy </strong> </p>
      <img src="https://root.cern/doc/master/pict1_graph.C.png" width="300" />
      <figcaption> Energy Total: 12374398274 mWs </figcaption>
      <button> <strong> Rerun </strong> </button>
    <p> <strong> Configuration settings: </strong> </p>
    <form>
    <input type="checkbox" name="root" /> root 
    <br> </br>
    <input type="checkbox" name="BLOCKSIZE" /> BLOCKSIZE
    <br> </br>
    <input type="checkbox" name="JOBS" /> JOBS 
    <br> </br>
    <input type="checkbox" name="LEVEL" /> LEVEL
    <br> </br>
    <input type="checkbox" name="CHECKSUM" /> CHECKSUM
    <br> </br>
    <input type="checkbox" name="SKIP" /> SKIP
    <br> </br>
    <input type="checkbox" name="NoTransform" /> NoTransform
    <br> </br>
    <input type="checkbox" name="Huffman" /> Huffman
    <br> </br>
    <input type="checkbox" name="ANS0" /> ANS0
    <br> </br>
    <input type="checkbox" name="ANS1" /> ANS1
    <br> </br>
    <input type="checkbox" name="Range" /> Range   
    </form>
    </figure>

    <figure>
    <p> <strong> Time </strong> </p>
      <img src="https://root.cern/doc/master/pict1_bent.C.png" width="300" />
      <figcaption> Time total: 739874192 ms </figcaption>
      <button> <strong> Compare </strong> </button>
    <form>
    <br> </br>
    <input type="checkbox" name="FPAQ" /> FPAQ 
    <br> </br>
    <input type="checkbox" name="TPAQ" /> TPAQ
    <br> </br>
    <input type="checkbox" name="CM" /> CM
    <br> </br>
    <input type="checkbox" name="NoEntropy" /> NoEntropy 
    <br> </br>
    <input type="checkbox" name="BWTS" /> BWTS
    <br> </br>
    <input type="checkbox" name="ROLZ" /> ROLZ
    <br> </br>
    <input type="checkbox" name="RLT" /> RLT
    <br> </br>
    <input type="checkbox" name="ZRLT" /> ZRLT
    <br> </br>
    <input type="checkbox" name="MTFT" /> MTFT
    <br> </br>
    <input type="checkbox" name="RANK" /> RANK
    <br> </br>
    <input type="checkbox" name="TEXT" /> TEXT
    <br> </br>
    <input type="checkbox" name="X86" /> X86
    </form>
    </figure>

		</body>
		</html>`;
    }
}
exports.ConfigMenu = ConfigMenu;
ConfigMenu.viewType = "green-ide";
//# sourceMappingURL=configMenu.js.map