// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';
import * as vscode from 'vscode';
import { WebviewPanel } from './WebviewPanel';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
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
		WebviewPanel.createOrShow(context.extensionUri);
	});

    context.subscriptions.push(disposable);

    // TODO: register function without having to execute it
    // Provides command to rerun the analysis
    let disposable1 = vscode.commands.registerCommand('greenIDE.rerun', () => {

        //TODO: finish command register
            
        // Starts procedure and updates webview panel
        runAnalysis();
        WebviewPanel.createOrShow(context.extensionUri);
    });

    context.subscriptions.push(disposable1);

    // Start DocumentSymbolProvider to find methods
	context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
        {language: "java"}, new JavaDocumentSymbolProvider()
    ));
}

// Performs analysis
// Procedure order: 1. retreive funtions, 2. provide methods to backend,
// 3. retreive analysis from backend, 4. display analysis
function runAnalysis(){
    
    
    // TODO: do procedure order

}

// Implementation of documentSymbolProvider to find all parts of code containing 'kanzi.'
class JavaDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(document: vscode.TextDocument,
            token: vscode.CancellationToken): Thenable<vscode.SymbolInformation[]> {
        return new Promise((resolve) => {
            var symbols = [];
            var containerNumber = 0;

            // Find 'kanzi.' in document/code
            for (var i = 0; i < document.lineCount; i++) {
                var line = document.lineAt(i);
                // Add found kanzi location to object with line
                if (line.text.includes("kanzi.")) {
                    symbols.push({
                        name: line.text.substr(1),
                        kind: vscode.SymbolKind.Field,
                        containerName: containerNumber.toString(),
                        location: new vscode.Location(document.uri, line.range)
                    })
                    containerNumber++;
                }
            }
            resolve(symbols);
        }); 
    }
}

// this method is called when your extension is deactivated
export function deactivate() {}
