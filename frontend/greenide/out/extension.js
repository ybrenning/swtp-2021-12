// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const WebviewPanel_1 = require("./WebviewPanel");
var functions = [];
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "greenide" is now active!');
    vscode.window.showInformationMessage('GreenIDE is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('greenIDE.run', () => {
        // The code you place here will be executed every time your command is executed
        // Starts procedure and updates webview panel
        runAnalysis();
        WebviewPanel_1.WebviewPanel.createOrShow(context.extensionUri);
    });
    context.subscriptions.push(disposable);
    // Start DocumentSymbolProvider to find methods
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ language: "java" }, new JavaDocumentSymbolProvider()));
}
exports.activate = activate;
// Performs analysis
// Procedure order:
//  1. retreive funtions, (done)
//  2. provide methods to backend,
//  3. retreive analysis from backend,
//  4. display results(Webview and syntax highlighting)
function runAnalysis() {
    for (var i = 0; i < functions.length; i++) {
        console.log(functions[i].name, functions[i].location.range.start.character, functions[i].location.range.end.character);
    }
    // TODO: do procedure order
}
// Implementation of documentSymbolProvider to find all parts of code containing 'kanzi.'
class JavaDocumentSymbolProvider {
    provideDocumentSymbols(document, token) {
        return new Promise((resolve) => {
            var symbols = [];
            var containerNumber = 0;
            // Find 'kanzi.' in document/code
            for (var i = 0; i < document.lineCount; i++) {
                var line = document.lineAt(i);
                // Add found kanzi location to object with line
                if (line.text.includes("kanzi.")) {
                    for (var j = 0; j < line.text.length; j++) {
                        //Search line for kanzi method
                        if (!line.text.substring(j).includes("kanzi.")) {
                            for (var k = j; k < line.text.length; k++) {
                                //Search for end of full kanzi name
                                if (line.text.substring(j - 1, k).includes("(")) {
                                    symbols.push({
                                        name: line.text.substr(j - 1, (k - 1) - (j - 1)),
                                        kind: vscode.SymbolKind.Method,
                                        containerName: containerNumber.toString(),
                                        location: new vscode.Location(document.uri, new vscode.Range(new vscode.Position(i, j), new vscode.Position(i, k)))
                                    });
                                    containerNumber++;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
            }
            functions = symbols;
            resolve(symbols);
        });
    }
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map