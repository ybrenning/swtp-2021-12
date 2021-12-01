// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const WebviewPanel_1 = require("./WebviewPanel");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "greenide" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('greenIDE.start', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('GreenIDE is now active!');
        WebviewPanel_1.WebviewPanel.createOrShow(context.extensionUri);
    });
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ language: "foo" }, new JavaDocumentSymbolProvider()));
}
exports.activate = activate;
class JavaDocumentSymbolProvider {
    provideDocumentSymbols(document, token) {
        return new Promise((resolve, reject) => {
            var symbols = [];
            for (var i = 0; i < document.lineCount; i++) {
                var line = document.lineAt(i);
                if (line.text.startsWith("@")) {
                    symbols.push({
                        name: line.text.substr(1),
                        kind: vscode.SymbolKind.Field,
                        location: new vscode.Location(document.uri, line.range)
                    });
                }
            }
            Promise.resolve(symbols);
        });
    }
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension%20copy.js.map