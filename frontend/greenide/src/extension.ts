// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';
import { listenerCount } from 'cluster';
import internal = require('stream');
import * as vscode from 'vscode';
import { WebviewPanel } from './WebviewPanel';

var functions: { name: string; kind: vscode.SymbolKind; containerName: string; location: vscode.Location; }[] = [];

//Values of the Analysis

type datum = {
    energy: number,
    time: number
} 

var function1: datum = {energy: 12, time: 19}
var function2: datum = {energy: 5, time: 28}
var function3: datum = {energy: 9, time: 23}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
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
		WebviewPanel.createOrShow(context.extensionUri);
	});

    context.subscriptions.push(disposable);

    // Start DocumentSymbolProvider to find methods
	context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
        {language: "java"}, new JavaDocumentSymbolProvider()
    ));
    
    //Start Hover Provider to create hovers
    context.subscriptions.push(vscode.languages.registerHoverProvider(
        {language: "java"}, new GoHoverProvider()
    ));        
}

// Performs analysis
// Procedure order:
//  1. retreive funtions, (done)
//  2. provide methods to backend,
//  3. retreive analysis from backend,
//  4. display results(Webview and syntax highlighting)
function runAnalysis(){

    // header for understanding methods output
    console.log('Name, line, start pos, end pos');

    // iterate over every saved method from code
    for(var i = 0; i < functions.length; i++){
        console.log(
            functions[i].name,                              // name of found kanzi method
            functions[i].location.range.start.line,         // line of found kanzi method
            functions[i].location.range.start.character,    // starting column of found kanzi method
            functions[i].location.range.end.character);     // ending column of found kanzi method
    }

    // TODO: do procedure order

}

// Implementation of documentSymbolProvider to find all parts of code containing 'kanzi.'
class JavaDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): Thenable<vscode.SymbolInformation[]> {
        return new Promise((resolve) => {
            var symbols = [];
            var containerNumber = 0;

            // Find 'kanzi.' in document/code
            for (var i = 0; i < document.lineCount; i++) {
                var line = document.lineAt(i);
                if (line.text.includes("kanzi.")) {
                    //Search line for kanzi method
                    for(var j = 0; j < line.text.length; j++){
                        if(!line.text.substring(j).includes("kanzi.")){
                            //Search for end of full kanzi name
                            for(var k = j; k < line.text.length; k++){
                                if(line.text.substring(j-1, k).includes("(")){
                                    // Add found kanzi name and location to object
                                    symbols.push({
                                        // substring only grabbing kanzi method name without braces
                                        name: line.text.substr(j-1, (k-1) - (j-1)),
                                        kind: vscode.SymbolKind.Method,
                                        containerName: containerNumber.toString(),
                                        location: new vscode.Location(document.uri, new vscode.Range(new vscode.Position(i+1, j), new vscode.Position(i+1, k)))
                                    })
                                    containerNumber++;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
            }
            // save symbols (all kanzi methods with metadata)
            functions = symbols;
            resolve(symbols);
        }); 
    }
}



class GoHoverProvider implements vscode.HoverProvider {
    public provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.Hover> {
        //document: currently open document, position: current position of cursor
        //both change dynamicaly as the user interacts with VSC so the methods also have to be dynamic
        return new Promise((resolve)=> {
            //Testimplementation of the Hover Provider and texthovers
            //TODO: [cheat method of changing configurations: insert empty newline in the java to change line values and add more linechecks here]
            var displaytext: string = "test"
                var line = position.line + 1;

                if(line == 5 ) {
                    displaytext = ('Energy: ' + function1.energy.toString() + '  Time: ' + function1.time.toString())
                }
                if(line == 16) {
                    displaytext = ('Energy: ' + function2.energy.toString() + '  Time: ' + function2.time.toString())
                }
                if(line == 22) {
                    displaytext = ('Energy: ' + function3.energy.toString() + '  Time: ' + function3.time.toString())
                }

            resolve(new vscode.Hover(displaytext))  
        });
    }
}

// this method is called when your extension is deactivated
export function deactivate() {}
