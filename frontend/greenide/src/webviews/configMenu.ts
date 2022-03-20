// Webview Panel to work with configurations
// - select config and apply as current config
// - save favorites
// - works with JSON to save configs (0 default/current, 1+ saved configs)

import * as vscode from "vscode";
import { getFolder } from "../functions/getFolder";
import { getNonce } from "../getNonce";
import { ConfigParser } from "../providers/configParser";

const folder = getFolder();

// The main webview Panel to work with
export class ConfigMenu {

  // Track the current panel. Only allow a single panel to exist at a time.
  public static currentPanel: ConfigMenu | undefined;

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
    if (ConfigMenu.currentPanel) {
      ConfigMenu.currentPanel._panel.reveal(column);
      ConfigMenu.currentPanel._update(extensionUri);
      return;
    }

    // Otherwise, create a new panel
    const panel = vscode.window.createWebviewPanel(
      ConfigMenu.viewType,
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
    ConfigMenu.currentPanel = new ConfigMenu(panel, extensionUri);
  }

  // Kill webview panel
  public static kill() {
    ConfigMenu.currentPanel?.dispose();
    ConfigMenu.currentPanel = undefined;
  }

  // Revive webview panel
  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    ConfigMenu.currentPanel = new ConfigMenu(panel, extensionUri);
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
        new ConfigParser(extensionUri,message.command,message.num,message.text);
      },
      undefined
    );
  }

  // The HTML content, main functionality of webview panel
  private _getHtmlForWebview(webview: vscode.Webview) {

    // Use a nonce to only allow specific scripts to be run
    const nonce = getNonce();

    // Read config JSON to display current configs
    const fs = require('fs');
    var data = fs.readFileSync(folder + '/greenide/configuration.json', 'utf8');
    var configList = data;

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
    
    <h2>GreenIDE Configuration Menu</h2>

    <figure>
    <h3>Change Config:</h3>
    <form>
    <input class="configCheckbox" type="checkbox" name="BLOCKSIZE" /> BLOCKSIZE
    <br><input class="configCheckbox" type="checkbox" name="JOBS" /> JOBS</br>
    <input class="configCheckbox" type="checkbox" name="LEVEL" /> LEVEL
    <br><input class="configCheckbox" type="checkbox" name="CHECKSUM" /> CHECKSUM</br>
    <input class="configCheckbox" type="checkbox" name="SKIP" /> SKIP
    <br><input class="configCheckbox" type="checkbox" name="NoTransform" /> NoTransform</br>
    <input class="configCheckbox" type="checkbox" name="Huffman" /> Huffman
    <br><input class="configCheckbox" type="checkbox" name="ANS0" /> ANS0</br>
    <input class="configCheckbox" type="checkbox" name="ANS1" /> ANS1
    <br><input class="configCheckbox" type="checkbox" name="Range" /> Range</br>
    <input class="configCheckbox" type="checkbox" name="FPAQ" /> FPAQ
    <br><input class="configCheckbox" type="checkbox" name="TPAQ" /> TPAQ</br>
    <input class="configCheckbox" type="checkbox" name="CM" /> CM
    <br><input class="configCheckbox" type="checkbox" name="NoEntropy" /> NoEntropy</br>
    <input class="configCheckbox" type="checkbox" name="BWTS" /> BWTS
    <br><input class="configCheckbox" type="checkbox" name="ROLZ" /> ROLZ</br>
    <input class="configCheckbox" type="checkbox" name="RLT" /> RLT
    <br><input class="configCheckbox" type="checkbox" name="ZRLT" /> ZRLT</br>
    <input class="configCheckbox" type="checkbox" name="MTFT" /> MTFT
    <br><input class="configCheckbox" type="checkbox" name="RANK" /> RANK</br>
    <input class="configCheckbox" type="checkbox" name="TEXT" /> TEXT
    <br><input class="configCheckbox" type="checkbox" name="X86" /> X86</br>
    <br></br>
    </form>
    <span onclick="applyConfig()"><button> <strong>Apply This Configuration</strong> </button></span>
    <span onclick="saveConfig()"><button> <strong>Save This Configuration</strong> </button></span>
    </figure>

    <figure>

    <h3>Available Configs:</h3>

    <div id="target-id"></div>

    <figure>
    Config to Load<br>
    <input id="69" type="text">
    <span onclick="loadConfig()"><button> <strong>Load Config</strong> </button></span>
    </figure>

    <figure>
    Config to Delete<br>
    <input id="420" type="text">
    <span onclick="deleteConfig()"><button> <strong>Delete Config</strong> </button></span>
    </figure>

    </figure>
    </body>

    <script>


    var mainContainer = document.getElementById("target-id");
    data = ${configList}

    for (var i = 0; i < data.config.length; i++) {
      var div = document.createElement("div");
      var configItems = [];
      for (var j = 0; j < data.config[i].config.length; j++) {
        configItems.push(' ' + data.config[i].config[j]);
      }
      div.innerHTML = data.config[i].name + ':&nbsp;&nbsp;[' + configItems + ' ]';
      mainContainer.appendChild(div);
    }
    

    function applyConfig() {
      var checkedValue = []; 
      var inputElements = document.getElementsByClassName('configCheckbox');
      for(var i=0; inputElements[i]; ++i){
            if(inputElements[i].checked){
                checkedValue.push(inputElements[i].name);
            }
      }
      const vscode = acquireVsCodeApi();
      vscode.postMessage({command: 'Apply', num: 0, text:checkedValue})
    }

    function saveConfig() {
      var checkedValue = []; 
      var inputElements = document.getElementsByClassName('configCheckbox');
      for(var i=0; inputElements[i]; ++i){
            if(inputElements[i].checked){
                checkedValue.push(inputElements[i].name);
            }
      }
      const vscode = acquireVsCodeApi();
      vscode.postMessage({command: 'Save', text:checkedValue})
    }

    function loadConfig() {
      var num = parseFloat(document.getElementById("69").value);
      const vscode = acquireVsCodeApi();
      vscode.postMessage({command: 'Load', num: num})
    }

    function deleteConfig() {
      var num = parseFloat(document.getElementById("420").value);
      const vscode = acquireVsCodeApi();
      vscode.postMessage({command: 'Delete', num: num})
    }

    </script>
    </html>`;
  }
}
