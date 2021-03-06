'use strict';
import * as vscode from 'vscode';
import { HomeProvider } from './providers/home';
import { MethodHighlight } from './providers/highlight';
import { runAnalysis } from './functions/runAnalysis';
import { GoHoverProvider } from './providers/GoHoverProvider';
import { startup } from './functions/startup';
import { sidePanelConfigs } from './functions/sidePanelConfig';
import { sidePanelSettings } from './functions/sidePanelSettings';
import { sidePanelHelp } from './functions/sidePanelHelp';
import { eventListener } from './functions/eventListener';
import { initiate } from './functions/initiate';
import { getFolder } from './functions/getFolder';

const folder = getFolder();

var functions: {
    name: string;
    method: string;
    runtime: number[];
    energy: number[];
    kind: vscode.SymbolKind;
    containerName: string;
    location: vscode.Location;
}[] = [];

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

    // create files and directories
    initiate();

    // auto start extension
    vscode.commands.executeCommand('greenIDE.run');

    // start extension
    let disposable = vscode.commands.registerCommand('greenIDE.run', async () => {

        // The code you place here will be executed every time your command is executed
        startup();

        // get data from backend and apply it to functions
        const anaPromise = runAnalysis(functions);

        // side panel segments loading
        const homePromise = sidePanelHome();
        const configsPromise = sidePanelConfigs(context);
        const settingsPromise = sidePanelSettings(context);
        const helpPromise = sidePanelHelp(context);
        // ||
        await anaPromise;
        await homePromise;
        await configsPromise;
        await settingsPromise;
        await helpPromise;
    });

    // async function resolving
    Promise.all([sidePanelHome(), sidePanelConfigs(context), sidePanelSettings(context), sidePanelHelp(context)]);

    context.subscriptions.push(disposable);

    // This creates the side panel segment 'GreenIDE' where the user sees the found methods, 
    // refresh for new found methods and select items to highlight them
    async function sidePanelHome() {

        // Creates tree view for first segment of side panel, home of extension actions
        var homeTreeView = vscode.window.createTreeView("greenIDE-home", {
            treeDataProvider: new HomeProvider(functions)
        });

        // Set name for first segment
        homeTreeView.title = 'GREENIDE';
        homeTreeView.description = 'Refresh GreenIDE:';

        // When clicking on a method from tree
        let clickEvent = vscode.commands.registerCommand('greenIDE-home.click', (functionI: {
            name: string;
            runtime: number[];
            energy: number[];
            kind: vscode.SymbolKind;
            containerName: string;
            location: vscode.Location;
        }) => {
            var line = functionI.location.range.start.line - 1;
            var character = functionI.location.range.start.character;
            var name = functionI.name;

            // Execute vscode commandto jump to location at (line,character)
            const functionPosition = new vscode.Position(line, character);
            vscode.window.activeTextEditor!.selections = [new vscode.Selection(functionPosition, functionPosition)];
            var range = new vscode.Range(functionPosition, functionPosition);
            vscode.window.activeTextEditor?.revealRange(range);
            vscode.commands.executeCommand("workbench.action.focusActiveEditorGroup");

            // Create Highlight object which stores provided data
            let testHighlight = new MethodHighlight(
                functionI.location.range.start.line,
                functionI.location.range.start.character,
                functionI.location.range.end.character,
                functionI.runtime,
                functionI.energy
            );

            // Execute highlight with provided data
            testHighlight.decorate;
        });

        // When clicking on 'header', namely 'found methods'
        let clickEventAll = vscode.commands.registerCommand('greenIDE-home.clickAll', () => {
            // Iterate over functions array to highlight each function with provided data
            for (var i = 0; i < functions.length; i++) {
                // Highlight each element from functions[i] at it's proper location
                let testHighlight = new MethodHighlight(
                    functions[i].location.range.start.line,
                    functions[i].location.range.start.character,
                    functions[i].location.range.end.character,
                    functions[i].runtime,
                    functions[i].energy
                );

                // Execute highlight with provided data
                testHighlight.decorate;
            }
        });

        context.subscriptions.push(clickEvent);
        context.subscriptions.push(clickEventAll);
        context.subscriptions.push(homeTreeView);
    }

    // add DocumentSymbolProvider to listening for execution
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
        { language: "java" }, new JavaDocumentSymbolProvider()
    ));

    // add eventListener which reloads DocumentSymbolProvider when switching file tabs or opening new file
    eventListener(context);

    // Start Hover Provider to create hovers
    context.subscriptions.push(vscode.languages.registerHoverProvider(
        { language: "java" }, new GoHoverProvider()
    ));
}

// Implementation of documentSymbolProvider to find all parts of code containing methods from locatorItems.json
export class JavaDocumentSymbolProvider implements vscode.DocumentSymbolProvider {

    // execute DocumentSymbolProvider
    public provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): Thenable<vscode.SymbolInformation[]> {

        // Use in iteration to find methods
        var foundMethods: string[] = [];

        return new Promise((resolve) => {

            foundMethods = [];
            // Redunant functions saved for iteration
            var functionsR: { name: string; method: string; runtime: number[]; energy: number[]; kind: vscode.SymbolKind; containerName: string; location: vscode.Location; }[] = [];
            functionsR = [];
            functions = [];
            var containedMethods = [];
            var symbols = [];
            var containerNumber = 0;

            // SEVERAL METHOD LISTS TO OPERATE
            // ??? methodlistFULL: original method list, imported from file (e.g. JSON)
            // ?????methodlistIMP: sliced off after last dot to find implementations
            //   ??? methodlistIMPwD: methodlistIMP without duplicates
            // ?????methodlistMET: all the methods
            // ??? methodlist: the implementations and their belonging methods

            // Full methodlist from backend, to edit prefered methods: edit locatorList.json in workspace
            const fs = require('fs');
            var data = JSON.parse(fs.readFileSync(folder + '/greenide/locatorItems.json', 'utf8'));
            var methodlistFULL: string[] = [];
            for (var n1 = 0; n1 < data.methods.length; n1++) { methodlistFULL[n1] = JSON.stringify(data.methods[n1]); }

            // First sublist: slice at the last dot to check for implemenation
            // Second sublist: take second part after slice for methods
            var methodlistIMP = [];  // names for implementation
            var methodlistMET = [];  // names for methods
            for (var n2 = 0; n2 < methodlistFULL.length; n2++) {
                var index = methodlistFULL[n2].lastIndexOf('.');
                methodlistIMP[n2] = methodlistFULL[n2].slice(1, index);
                methodlistMET[n2] = methodlistFULL[n2].slice(index + 1, methodlistFULL[n2].length - 3);
            }

            // Purge duplicates in methodlistIMP
            let methodlistIMPwD: string[] = [];
            methodlistIMP.forEach((i) => { if (!methodlistIMPwD.includes(i)) { methodlistIMPwD.push(i); } });

            // Two dimensional list of methods to find methods after implementation
            // methodlist = [implemented][method]
            var methodlist = [];
            for (var k = 0; k < methodlistIMP.length; k++) { methodlist.push([methodlistIMP[k], methodlistMET[k]]); }

            // MECHANIC

            // Find method in document/code
            // for each line in code
            for (var i = 0; i < document.lineCount; i++) {
                // current line
                var line = document.lineAt(i);
                // loop 1: find method implementations
                for (var temp = 0; temp < methodlist.length; temp++) {
                    // if method is in line add it to containedMethods
                    if (line.text.includes('import ' + methodlist[temp][0])) { containedMethods.push(methodlist[temp]); }
                }

                // Loop 2: find objects / methods from imported method
                for (var temp = 0; temp < containedMethods.length; temp++) {
                    var impMeth = containedMethods[temp][0].slice(containedMethods[temp][0].lastIndexOf('.') + 1, containedMethods[temp][0].length);
                    // if method is used ...
                    if (line.text.includes(' new ' + impMeth + '(')) {
                        // if method is a renamed object ...
                        if (line.text.includes('= new ' + impMeth + '(')) {
                            // mark location of method
                            for (var j = 0; j < line.text.length; j++) {

                                if (!line.text.substring(j).includes('= new ' + impMeth + '(')) {
                                    var k = 3;
                                    // check where name starts
                                    do { k++; } while (!line.text.substring(j - k - 1, j - 3).includes(' '));

                                    // search for target
                                    var target = line.text.substring(j - k, j - 3);
                                    var iCopy = i + 1;         // logically stay at line i but search in segment between brackets
                                    var bracketCounter = 0;    // to count brackets for instance

                                    do {
                                        // search for method application, like target.hash(0)
                                        if (document.lineAt(iCopy).text.includes(target + '.' + containedMethods[temp][1] + '(')) {
                                            for (var j2 = 0; j2 < document.lineAt(iCopy).text.length; j2++) {
                                                if (!document.lineAt(iCopy).text.substring(j2).includes(target + '.' + containedMethods[temp][1] + '(')) {
                                                    symbols.push({
                                                        // Substring only grabbing method name without braces
                                                        name: impMeth + '.' + containedMethods[temp][1] + '()',
                                                        method: containedMethods[temp][0] + '.' + containedMethods[temp][1],
                                                        runtime: [0, 0],
                                                        energy: [0, 0],
                                                        kind: vscode.SymbolKind.Object,
                                                        containerName: containerNumber.toString(),
                                                        location: new vscode.Location(document.uri, new vscode.Range(new vscode.Position(iCopy + 1, j2 + target.length), new vscode.Position(iCopy + 1, j2 + (target + '.' + containedMethods[temp][1]).length - 1)))
                                                    });
                                                    foundMethods[containerNumber] = methodlist[temp][1];
                                                    containerNumber++;
                                                    break;
                                                }
                                            }
                                        }

                                        // Count brackets to ensure we are still inside possible instance of target
                                        if (document.lineAt(iCopy).text.includes('{')) { bracketCounter++; }
                                        if (document.lineAt(iCopy).text.includes('}')) { bracketCounter--; }
                                        iCopy++;
                                    } while (bracketCounter >= 0);
                                }
                            }
                        } else {
                            // mark location of method
                            for (var j = 0; j < line.text.length; j++) {
                                if (!line.text.substring(j).includes(' new ' + impMeth + '(')) {
                                    symbols.push({
                                        // Substring only grabbing method name without braces
                                        name: impMeth + '()',
                                        method: containedMethods[temp][0] + '.' + containedMethods[temp][1],
                                        runtime: [0, 0],
                                        energy: [0, 0],
                                        kind: vscode.SymbolKind.Method,
                                        containerName: containerNumber.toString(),
                                        location: new vscode.Location(
                                            document.uri,
                                            new vscode.Range(new vscode.Position(i + 1, j + 4),
                                                new vscode.Position(i + 1, j + impMeth.length + 4))
                                        )
                                    });

                                    // apply foundMethods with data
                                    foundMethods[containerNumber] = methodlist[temp][1];
                                    containerNumber++;
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            // Save symbols (all methods with metadata)
            functionsR = symbols;
            // checkmark for iteration to eliminate duplicates
            var checkDup = false;

            // for every entry in functions ...
            for (var j = 0; j < functionsR.length; j++) {
                // check if for every entry in functionsWD (functions w/o duplicates)...
                for (var i = 0; i < functions.length; i++) {
                    // ... if some element already shares the same location ...
                    if ((functionsR[j].location.range.start.line === functions[i].location.range.start.line)
                        && (functionsR[j].location.range.start.character === functions[i].location.range.start.character)) {
                        // ... if so, this is a duplicate (checkDup = true)
                        checkDup = true;
                    }
                }
                // if there was no duplicate while iterating in functionsWD add this element from functions to functionsWD
                if (checkDup === false) { functions.push(functionsR[j]); }
                // reset checkDup for next iteration
                checkDup = false;
            }
            resolve(symbols);
        });
    }
}

// This method is called when your extension is deactivated
export function deactivate() { }

// return functions for other methods
export function getFunctions() { return functions; }