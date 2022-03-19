// Webview Panel to work with configurations
// - select config and apply as current config
// - save favorites
// - works with JSON to save configs (0 default/current, 1+ saved configs)

import * as vscode from "vscode";
import { getFunctions } from "../extension";
import { getNonce } from "../getNonce";
import { ConfigParser } from "../providers/configParser";

const folder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];

// The main webview Panel to work with
export class Overview {

  // Track the current panel. Only allow a single panel to exist at a time.
  public static currentPanel: Overview | undefined;

  public static readonly viewType = "green-ide";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  // Technically activate webview panel for configs
  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it
    if (Overview.currentPanel) {
      Overview.currentPanel._panel.reveal(column);
      Overview.currentPanel._update(extensionUri);
      return;
    }

    // Otherwise, create a new panel
    const panel = vscode.window.createWebviewPanel(
      Overview.viewType,
      "Config Menu",  // title of tab
      column || vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, "media"),
          vscode.Uri.joinPath(extensionUri, "out/compiled"),
        ],
      }
    );

    // Execute set up webview panel
    Overview.currentPanel = new Overview(panel, extensionUri);
  }

  // Kill webview panel
  public static kill() {
    Overview.currentPanel?.dispose();
    Overview.currentPanel = undefined;
  }

  // Revive webview panel
  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    Overview.currentPanel = new Overview(panel, extensionUri);
  }

  // Constructor for webview panel
  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {

    this._panel = panel;
    this._extensionUri = extensionUri;

    // Set the webview's initial HTML content
    this._update(extensionUri);

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  // Close webview panel
  public dispose() {
    Overview.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  // Activate webview content, HTML
  private async _update(extensionUri: vscode.Uri) {

    // Set current webview
    const webview = this._panel.webview;

    // Set HTML content for webview panel
    this._panel.webview.html = this._getHtmlForWebview(webview);

    // TODO: implement:
    // [X] - pressing on button to send checkboxed configs
    // [X] - saving config in JSON (default is 0)
    // [X] - new button to save favorite with name in JSON
    // [ ] - new segment: dropdown menu with favorites & delete button
    // Handle messages from the webview
    
    webview.onDidReceiveMessage(
      message => {
        
        // TEST suite
        console.log('MESSAGE FROM WEBVIEW:');
        console.log(message);
      },
      undefined
    );
  }

  // The HTML content, main functionality of webview panel
  private _getHtmlForWebview(webview: vscode.Webview) {

    // Use a nonce to only allow specific scripts to be run
    const nonce = getNonce();

    var functions: { 
      name: string; 
      method: string; 
      runtime: number[];
      energy: number[];
      kind: vscode.SymbolKind; 
      containerName: string; 
      location: vscode.Location;
  }[] = getFunctions();

    // Get path of css file to be used within the Webview's HTML
    const stylesPathMainPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css');
    const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);

    // Return HTML to be rendered within the Webview
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="${stylesMainUri}" rel="stylesheet">
    <script nonce="${nonce}">
    </script>
    </head>
    <body>

    <figure>
    <span onclick="refresh()"><button> <strong>Refresh GreenIDE</strong> </button></span>
    </figure>

    </body>

    <script>

    function loadConfig() {
      const vscode = acquireVsCodeApi();
      vscode.postMessage({text: 'Hello World'})
    }

    </script>
    </html>`;
  }
}
