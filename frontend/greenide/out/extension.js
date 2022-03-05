// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const home_1 = require("./providers/home");
const configs_1 = require("./providers/configs");
const help_1 = require("./providers/help");
const kanziJSON = require("./method_list.json");
var foundMethods = [];
var functions = [];
var config = 0;
var function1Data;
var function2Data;
var function3Data;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
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
        var homeTreeView = vscode.window.createTreeView("greenIDE-home", {
            treeDataProvider: new home_1.HomeProvider(functions)
        });
        // Set name for first segment
        homeTreeView.title = 'GREENIDE';
        homeTreeView.description = 'Run GreenIDE:';
        let clickEvent = vscode.commands.registerCommand('greenIDE-home.click', (url) => {
            // TODO: implement reveal on click, url should be parsed in home.ts command
            vscode.env.openExternal(vscode.Uri.parse(url));
        });
        context.subscriptions.push(clickEvent);
        context.subscriptions.push(homeTreeView);
    }
    function sidePanelConfigs() {
        // creates tree view for second segment of side panel, place for configs
        var configsTreeView = vscode.window.createTreeView("greenIDE-configs", {
            treeDataProvider: new configs_1.ConfigsProvider
        });
        // Set name for second segment
        configsTreeView.title = 'CONFIGURATIONS';
        configsTreeView.message = 'Choose Configs:';
        context.subscriptions.push(configsTreeView);
    }
    function sidePanelHelp() {
        // creates tree view for third segment of side panel, get instructions, commands, help links etc
        var helpTreeView = vscode.window.createTreeView("greenIDE-help", {
            treeDataProvider: new help_1.HelpProvider
        });
        // Set name for third segment
        helpTreeView.title = 'HELP';
        helpTreeView.message = 'How To use';
        context.subscriptions.push(helpTreeView);
    }
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
    // make space
    for (var t = 0; t < 100; t++) {
        console.log('\n');
    }
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
}
// Implementation of documentSymbolProvider to find all parts of code containing 'kanzi.'
class JavaDocumentSymbolProvider {
    provideDocumentSymbols(document, token) {
        return new Promise((resolve) => {
            foundMethods = [];
            functions = [];
            var symbols = [];
            var containerNumber = 0;
            // TODO: replace kanzilist elements with all elements of method_list.txt (all kanzi methods)
            // Find from list imported Kanzi, e.g. kanzi.util.hash.XXHash32
            // then find implemented method, e.g. from kanzi...hash32 --> .hash()
            // Problem: if object is created, find method applied to that object, just that object
            // idea: top down brackets, search for created objects with second last segment (e.g. XXHash32 created as hash, save name of object)
            // then search for method applied to that object inside of brackets (count closing brackets, +1 if opening, -1 if closing, if <0 break)
            // if method is found applied to object (e.g. 'hash.hash(' ) this is the wanted method
            // SEVERAL KANZI LISTS TO OPERATE
            // – kanzilistFULL: original kanzi list, imported from file (e.g. JSON)
            // – kanzilistIMP: sliced off after last dot to find implementations
            //   – KanzilistIMPwD: kanzilistIMP without duplicates
            // – kanzilistMET: all the methods
            // – kanzilist: the implementations and their belonging methods
            // Full Kanzilist from CSV, to edit kanzi methods: edit method_list.json
            var kanzilistFULL = [];
            for (var n1 = 0; n1 < kanziJSON.kanzimethods.length; n1++) {
                kanzilistFULL[n1] = JSON.stringify(kanziJSON.kanzimethods[n1]);
            }
            // first sublist: slice at the last dot to check for implemenation
            // second sublist: take second part after slice for methods
            var kanzilistIMP = []; // names for implementation
            var kanzilistMET = []; // names for methods
            for (var n2 = 0; n2 < kanzilistFULL.length; n2++) {
                var index = kanzilistFULL[n2].lastIndexOf('.');
                kanzilistIMP[n2] = kanzilistFULL[n2].slice(1, index);
                kanzilistMET[n2] = kanzilistFULL[n2].slice(index + 1, kanzilistFULL[n2].length - 1);
            }
            // purge duplicates in kanzilistIMP
            let kanzilistIMPwD = [];
            kanzilistIMP.forEach((i) => {
                if (!kanzilistIMPwD.includes(i)) {
                    kanzilistIMPwD.push(i);
                }
            });
            // Two dimensional list of kanzi methods to find methods after implementation
            var kanzilist = [];
            for (var k = 0; k < kanzilistIMP.length; k++) {
                kanzilist.push([kanzilistIMP[k], kanzilistMET[k]]);
            }
            // MECHANIC
            // Find "kanzi." in document/code
            // for each line in code
            for (var i = 0; i < document.lineCount; i++) {
                var line = document.lineAt(i);
                // find kanzi method
                for (var temp = 0; temp < kanzilistFULL.length; temp++) 
                // TODO: find implemented Kanzi and the location of their method implementation
                // [ ] Kanzi Implementation detected
                // [ ] Corresponding Methods found (also for created Objects)
                // if kanzi method is in line
                {
                    if (line.text.includes('import ' + kanzilistIMPwD[temp])) {
                        for (var j = 0; j < line.text.length; j++) {
                            if (!line.text.substring(j).includes(' ' + kanzilistIMPwD[temp])) {
                                // // Search for end of full kanzi name
                                // for (var k = j; k < line.text.length; k++) {
                                //     if (line.text.substring(j-1, k).includes(";")) {
                                //         // Add found kanzi name and location to object
                                symbols.push({
                                    // Substring only grabbing kanzi method name without braces
                                    // name: line.text.substr(j-1, (k-1) - (j-1)),
                                    name: kanzilistIMPwD[temp],
                                    kind: vscode.SymbolKind.Method,
                                    containerName: containerNumber.toString(),
                                    location: new vscode.Location(document.uri, new vscode.Range(new vscode.Position(i + 1, j + 1), new vscode.Position(i + 1, j + kanzilistIMPwD[temp].length + 1)))
                                });
                                foundMethods[containerNumber] = kanzilistIMPwD[temp];
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