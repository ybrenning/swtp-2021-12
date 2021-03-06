"use strict";
// Webview Panel to work with configurations
// - select config and apply as current config
// - save favorites
// - works with JSON to save configs (0 default/current, 1+ saved configs)
Object.defineProperty(exports, "__esModule", { value: true });
exports.Overview = void 0;
const vscode = require("vscode");
const extension_1 = require("../extension");
const getFolder_1 = require("../functions/getFolder");
const getNonce_1 = require("../getNonce");
const folder = (0, getFolder_1.getFolder)();
// The main webview Panel to work with
class Overview {
    // Constructor for webview panel
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        // Set the webview's initial HTML content
        this._update(extensionUri);
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }
    // Technically activate webview panel for configs
    static createOrShow(extensionUri) {
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
        const panel = vscode.window.createWebviewPanel(Overview.viewType, "Config Menu", // title of tab
        column || vscode.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,
            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [
                vscode.Uri.joinPath(extensionUri, "media"),
                vscode.Uri.joinPath(extensionUri, "out/compiled"),
            ],
        });
        // Execute set up webview panel
        Overview.currentPanel = new Overview(panel, extensionUri);
    }
    // Kill webview panel
    static kill() {
        Overview.currentPanel?.dispose();
        Overview.currentPanel = undefined;
    }
    // Revive webview panel
    static revive(panel, extensionUri) {
        Overview.currentPanel = new Overview(panel, extensionUri);
    }
    // Close webview panel
    dispose() {
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
    async _update(extensionUri) {
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
        webview.onDidReceiveMessage(message => {
            // Open webview 'ConfigMenu'
            Overview.currentPanel?.dispose();
            Overview.createOrShow(extensionUri);
        }, undefined);
    }
    // The HTML content, main functionality of webview panel
    _getHtmlForWebview(webview) {
        // Use a nonce to only allow specific scripts to be run
        const nonce = (0, getNonce_1.getNonce)();
        var functions = (0, extension_1.getFunctions)();
        var funcArr = [];
        // pasrse into array for HTML
        for (let i = 0; i < functions.length; i++) {
            // the name
            funcArr[i][0] = functions[i].name;
            // the default data
            funcArr[i][1] = functions[i].runtime[0] + 'ms, ' + functions[i].energy[0] + 'mWs';
            // the applied data
            funcArr[i][2] = functions[i].runtime[1] + 'ms, ' + functions[i].energy[1] + 'mWs';
            funcArr[i][3] = (functions[i].runtime[1] - functions[i].runtime[0]) + 'ms, ' + (functions[i].energy[1] - functions[i].energy[0]) + 'mWs';
        }
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

    <h2>GreenIDE Data Overview</h2>

    <div id="my-table"></div>

    <h3>TEST TABLE</h3>

    <table>
      <tr>
        <th>Function&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
        <th>Data With No Config&nbsp;&nbsp;</th>
        <th>Data With Config&nbsp;&nbsp;</th>
        <th>Difference</th>
      </tr>
      <tr>
        <td>TEST</td>
        <td>123</td>
        <td>32</td>
        <td>42</td>
      </tr>
      <tr>
        <td>kanzi.function.ROLZCodec.<init></td>
        <td>321</td>
        <td>32</td>
        <td>45</td>
      </tr>
    </table>

    </body>

    <script>

    // dynamic function to cteate table out of 2d arrays
    function createTable(element, tableData) {
      
      // creating table elements
      var table = document.createElement('table');
      // creating table body <tbody> element
      var tableBody = document.createElement('tbody');

      // creating rows based on first diamention datas
      tableData.forEach(function(rowData) {
        var row = document.createElement('tr');

        // creating cells in each row based on second diamention datas
        rowData.forEach(function(cellData) {
          var cell = document.createElement('td');
          // adding array item to it's cell
          cell.appendChild(document.createTextNode(cellData));
          // adding the cell to it's row
          row.appendChild(cell);
        });

        // adding each row to table body
        tableBody.appendChild(row);
      });

      // adding table body to table
      table.appendChild(tableBody);
      // adding table to document body
      element.appendChild(table);
    }

    // example
    createTable(
      document.getElementById('my-table'),
      ${funcArr}
    );

    </script>
    </html>`;
    }
}
exports.Overview = Overview;
Overview.viewType = "green-ide";
//# sourceMappingURL=overview.js.map