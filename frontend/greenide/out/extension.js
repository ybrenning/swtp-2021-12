// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const WebviewPanel_1 = require("./WebviewPanel");
var foundMethods = [];
var functions = [];
var config = 0;
var function1Data;
var function2Data;
var function3Data;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
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
    // Hardcode to set data for output
    let cmd1 = vscode.commands.registerCommand('greenIDE.config1', () => {
        config = 1;
        console.log('Active Configuration: TPAQ, ROLZ');
        function1Data = { time: 2567.38007840983203, energy: 1823.4644462499255 };
        function2Data = { time: -28.9912719904026845, energy: -36.3591803758968134 };
    });
    let cmd2 = vscode.commands.registerCommand('greenIDE.config2', () => {
        config = 2;
        console.log('Active Configuration: ANSI1, RLT');
        function1Data = { time: 3605.0363865159459, energy: 2630.4899197729041 };
        function2Data = { time: 23.627126336485886, energy: 65.8686502751974591 };
    });
    let cmd3 = vscode.commands.registerCommand('greenIDE.config3', () => {
        config = 3;
        console.log('Active Configuration: SKIP, RLT');
        function1Data = { time: 3444.99055318259663, energy: 2384.124905294016 };
        function2Data = { time: 63.650126336456219, energy: 104.0431691254021741 };
    });
    context.subscriptions.push(cmd1);
    context.subscriptions.push(cmd2);
    context.subscriptions.push(cmd3);
    // Start DocumentSymbolProvider to find methods
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ language: "java" }, new JavaDocumentSymbolProvider()));
    // Start Hover Provider to create hovers
    context.subscriptions.push(vscode.languages.registerHoverProvider({ language: "java" }, new GoHoverProvider()));
}
exports.activate = activate;
// Performs analysis
// Procedure order:
//  1. retreive funtions, (done)
//  2. provide methods to backend,
//  3. retreive analysis from backend,
//  4. display results(Webview and syntax highlighting)
function runAnalysis() {
    // header for understanding methods output
    console.log('Found Kanzi Methods');
    console.log('Name, line, start pos, end pos');
    // Display the found "kanzi." methods from java source code
    for (var i = 0; i < functions.length; i++) {
        console.log(functions[i].name, // name of found kanzi method
        functions[i].location.range.start.line, // line of found kanzi method
        functions[i].location.range.start.character, // starting column of found kanzi method
        functions[i].location.range.end.character // ending column of found kanzi method
        );
    }
    console.log('Start Test');
    // TODO: do procedure order
    for (var j = 0; j < foundMethods.length; j++) {
        console.log(foundMethods[j]);
    }
    console.log('End Test');
}
// Implementation of documentSymbolProvider to find all parts of code containing 'kanzi.'
class JavaDocumentSymbolProvider {
    provideDocumentSymbols(document, token) {
        return new Promise((resolve) => {
            var symbols = [];
            var containerNumber = 0;
            // TODO: replace kanzilist elements with all elements of method_list.txt (all kanzi methods)
            var kanzilist = ['InsertionSort()', 'HeapSort()'];
            // Find "kanzi." in document/code
            // for each line in code
            for (var i = 0; i < document.lineCount; i++) {
                var line = document.lineAt(i);
                // find kanzi method
                for (var temp = 0; temp < kanzilist.length; temp++) 
                // TODO: cut from kanzi.[...] to namely method with _function()
                // if kanzi method is in line
                {
                    if (line.text.includes(' ' + kanzilist[temp])) {
                        for (var j = 0; j < line.text.length; j++) {
                            if (!line.text.substring(j).includes(' ' + kanzilist[temp])) {
                                // // Search for end of full kanzi name
                                // for (var k = j; k < line.text.length; k++) {
                                //     if (line.text.substring(j-1, k).includes(";")) {
                                //         // Add found kanzi name and location to object
                                symbols.push({
                                    // Substring only grabbing kanzi method name without braces
                                    // name: line.text.substr(j-1, (k-1) - (j-1)),
                                    name: kanzilist[temp],
                                    kind: vscode.SymbolKind.Method,
                                    containerName: containerNumber.toString(),
                                    location: new vscode.Location(document.uri, new vscode.Range(new vscode.Position(i + 1, j + 1), new vscode.Position(i + 1, j + kanzilist[temp].length + 1)))
                                });
                                foundMethods[containerNumber] = kanzilist[temp];
                                containerNumber++;
                                break;
                            }
                        }
                    }
                }
            }
            // Save symbols (all kanzi methods with metadata)
            functions = symbols;
            resolve(symbols);
        });
    }
}
class GoHoverProvider {
    provideHover(document, position, token) {
        // document: currently open document, position: current position of cursor
        // Both change dynamically as the user interacts with VSC so the methods also have to be dynamic
        return new Promise((resolve) => {
            var displaytext = "";
            // Keep here for actual implementation
            /*
            switch(config) {
                case 1: {
                    for(var funct in functions) {
                        if(funct.location.line == position.line) {
                            displaytext = function1Data
                        }
                    }
                    break;
                }
                case 2: {
                   //statements;
                   break;
                }
                case 3: {
        
                    break;
                }
                default: {
                    
                   break;
                }
            }
            */
            // Determines what information to show and saves it to displaytext
            var line = position.line + 1;
            if (line === 29) {
                displaytext = ('Energy: ' + function1Data.energy.toString() + 'mWs   Time: ' + function1Data.time.toString() + 'ms');
            }
            ;
            if (line === 30) {
                displaytext = ('Energy: ' + function1Data.energy.toString() + 'mWs   Time: ' + function1Data.time.toString() + 'ms');
            }
            ;
            if (line === 36) {
                displaytext = ('Energy: ' + function2Data.energy.toString() + 'mWs   Time: ' + function2Data.time.toString() + 'ms');
            }
            ;
            if (line === 37) {
                displaytext = ('Energy: ' + function2Data.energy.toString() + 'mWs   Time: ' + function2Data.time.toString() + 'ms');
            }
            ;
            resolve(new vscode.Hover(displaytext));
        });
    }
}
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map