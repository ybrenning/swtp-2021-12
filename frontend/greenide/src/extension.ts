// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';
import * as vscode from 'vscode';
import { WebviewPanel } from './WebviewPanel';
import { HomeProvider } from './providers/home';
import { ConfigsProvider } from './providers/configs';
import { HelpProvider } from './providers/help';
import { removeAllListeners } from 'process';

var foundMethods: string[] = [];
var functions: {
    name: string;
    kind: vscode.SymbolKind;
    containerName: string;
    location: vscode.Location;
}[] = [];

var config: number = 0;

// Values of the Analysis
type Datum = {
    energy: number,
    time: number
};

var function1Data: Datum;
var function2Data: Datum;
var function3Data: Datum;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // auto start extension
    vscode.commands.executeCommand('greenIDE.run');

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "greenide" is now active!');

    // TODO: Auto run extension / command on startup
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('greenIDE.run', () => {
        // The code you place here will be executed every time your command is executed
        // Starts procedure and updates webview panel
        runAnalysis();

        // side panel segments loading
        sidePanelHome();
        sidePanelConfigs();
        sidePanelHelp();

        // old webview panel
        // WebviewPanel.createOrShow(context.extensionUri);
    });

    context.subscriptions.push(disposable);

    function sidePanelHome() {
    
        // creates tree view for first segment of side panel, home of extension actions
        var homeTreeView = vscode.window.createTreeView( "greenIDE-home", {
            treeDataProvider: new HomeProvider(functions) 
        });
    
        // Set name for first segment
        homeTreeView.title = 'GREENIDE';
        homeTreeView.description = 'Run GreenIDE:';

        let clickEvent = vscode.commands.registerCommand('greenIDE-home.click', ( url ) => {

            // TODO: implement reveal on click, url should be parsed in home.ts command
            vscode.env.openExternal( vscode.Uri.parse( url ));
        });
    
        context.subscriptions.push(clickEvent);
        context.subscriptions.push(homeTreeView);
    }
    
    function sidePanelConfigs() {
    
        // creates tree view for second segment of side panel, place for configs
        var configsTreeView = vscode.window.createTreeView( "greenIDE-configs", {
            treeDataProvider: new ConfigsProvider 
        });
    
        // Set name for second segment
        configsTreeView.title = 'CONFIGURATIONS';
        configsTreeView.message = 'Choose Configs:';

        context.subscriptions.push(configsTreeView);
    }
    
    function sidePanelHelp() {
    
        // creates tree view for third segment of side panel, get instructions, commands, help links etc
        var helpTreeView = vscode.window.createTreeView( "greenIDE-help", {
            treeDataProvider: new HelpProvider 
        });
    
        // Set name for third segment
        helpTreeView.title = 'HELP';
        helpTreeView.message = 'How To use';

        context.subscriptions.push(helpTreeView);
    }

    
    
    

    // Start DocumentSymbolProvider to find methods
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
        { language: "java" }, new JavaDocumentSymbolProvider()
    ));

    // Start Hover Provider to create hovers
    context.subscriptions.push(vscode.languages.registerHoverProvider(
        { language: "java" }, new GoHoverProvider()
    ));
}

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
        console.log(
            functions[i].name,                              // name of found kanzi method
            functions[i].location.range.start.line,         // line of found kanzi method
            functions[i].location.range.start.character,    // starting column of found kanzi method
            functions[i].location.range.end.character       // ending column of found kanzi method
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
class JavaDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): Thenable<vscode.SymbolInformation[]> {
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
                    {if (line.text.includes(' ' + kanzilist[temp])) {

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
                    }}
            }
            // Save symbols (all kanzi methods with metadata)
            functions = symbols;
            resolve(symbols);
        });
    }
}



class GoHoverProvider implements vscode.HoverProvider {
    public provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.Hover> {
        // document: currently open document, position: current position of cursor
        // Both change dynamically as the user interacts with VSC so the methods also have to be dynamic
        return new Promise((resolve) => {
            var displaytext: string = "";

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
            };

            if (line === 30) {
                displaytext = ('Energy: ' + function1Data.energy.toString() + 'mWs   Time: ' + function1Data.time.toString() + 'ms');
            };

            if (line === 36) {
                displaytext = ('Energy: ' + function2Data.energy.toString() + 'mWs   Time: ' + function2Data.time.toString() + 'ms');
            };

            if (line === 37) {
                displaytext = ('Energy: ' + function2Data.energy.toString() + 'mWs   Time: ' + function2Data.time.toString() + 'ms');
            };

            resolve(new vscode.Hover(displaytext));
        });
    }
}

// This method is called when your extension is deactivated
export function deactivate() { }