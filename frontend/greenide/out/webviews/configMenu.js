"use strict";
// Webview Panel to work with configurations
// - select config and apply as current config
// - save favorites
// - works with JSON to save configs (0 default/current, 1+ saved configs)
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigMenu = void 0;
const vscode = require("vscode");
const getNonce_1 = require("../getNonce");
// the main webview Panel to work with
class ConfigMenu {
    // constructor for webview panel
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        // set the webview's initial HTML content
        this._update();
        // listen for when the panel is disposed
        // this happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // from old webview
        /*// // Handle messages from the webview
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
        // );*/
    }
    // technically activate webview panel for configs
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        // if we already have a panel, show it
        if (ConfigMenu.currentPanel) {
            ConfigMenu.currentPanel._panel.reveal(column);
            ConfigMenu.currentPanel._update();
            return;
        }
        // otherwise, create a new panel
        const panel = vscode.window.createWebviewPanel(ConfigMenu.viewType, "Config Menu", // title of tab
        column || vscode.ViewColumn.One, {
            // enable javascript in the webview
            enableScripts: true,
            // and restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [
                vscode.Uri.joinPath(extensionUri, "media"),
                vscode.Uri.joinPath(extensionUri, "out/compiled"),
            ],
        });
        // execute set up webview panel
        ConfigMenu.currentPanel = new ConfigMenu(panel, extensionUri);
    }
    // kill webview panel
    static kill() {
        ConfigMenu.currentPanel?.dispose();
        ConfigMenu.currentPanel = undefined;
    }
    // revive webview panel
    static revive(panel, extensionUri) {
        ConfigMenu.currentPanel = new ConfigMenu(panel, extensionUri);
    }
    // close webview panel
    dispose() {
        ConfigMenu.currentPanel = undefined;
        // clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    // activate webview content, HTML
    async _update() {
        // set current webview
        const webview = this._panel.webview;
        // set HTML content for webview panel
        this._panel.webview.html = this._getHtmlForWebview(webview);
        // TODO: implement:
        // [X] - pressing on button to send checkboxed configs
        // [X] - saving config in JSON (default is 0)
        // [X] - new button to save favorite with name in JSON
        // [ ] - new segment: dropdown menu with favorites & delete button
        // Handle messages from the webview
        webview.onDidReceiveMessage(message => {
            // TEST suite
            console.log('MESSAGE RECEIVED FROM WEBVIEW');
            console.log(message);
            // new ConfigParser(message.command,message.num,message.text);
        }, undefined);
    }
    // the HTML content, main functionality of webview panel
    _getHtmlForWebview(webview) {
        // Use a nonce to only allow specific scripts to be run
        const nonce = (0, getNonce_1.getNonce)();
        // read config JSON to display current configs
        const fs = require('fs');
        var data = fs.readFileSync('/Users/ferris/PECK/kanzi-1.7.0/configurations/configuration.json', 'utf8');
        const configList = data;
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

    <style>
    ul, #myUL {
      list-style-type: none;
    }
    
    #myUL {
      margin: 0;
      padding: 0;
    }
    
    .caret {
      cursor: pointer;
      -webkit-user-select: none; /* Safari 3.1+ */
      -moz-user-select: none; /* Firefox 2+ */
      -ms-user-select: none; /* IE 10+ */
      user-select: none;
    }
    
    .caret::before {
      content: "\\25B7";
      color: white;
      display: inline-block;
      margin-right: 6px;
    }
    
    .caret-down::before {
      -ms-transform: rotate(90deg); /* IE 9 */
      -webkit-transform: rotate(90deg); /* Safari */'
      transform: rotate(90deg);  
    }
    
    .nested {
      display: none;
    }
    
    .active {
      display: block;
    }
    </style>

    </head>
    <body>
    
    <h2>GreenIDE Configuration Menu</h2>

    <figure>
    <h3>Change Config:</h3>
    <form>
    <br><input class="configCheckbox" type="checkbox" name="root" /> root</br>
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

    <span onclick="displayConfigs()"><button id = "9491"> <strong>Display Configs</strong> </button></span>
    <br></br>
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

    function displayConfigs() {

      var mainContainer = document.getElementById("target-id"); 
      data = ${configList}

      for (var i = 0; i < data.config.length; i++) {
        var div = document.createElement("div");
        var configItems = [];
        for (var j = 0; j < data.config[i].config.length; j++) {
          configItems.push(' ' + data.config[i].config[j]);
        }
        div.innerHTML = 'ID: ' + data.config[i].id + ' Config: [' + configItems + ' ]';
        mainContainer.appendChild(div);
      }
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
exports.ConfigMenu = ConfigMenu;
ConfigMenu.viewType = "green-ide";
//# sourceMappingURL=configMenu.js.map