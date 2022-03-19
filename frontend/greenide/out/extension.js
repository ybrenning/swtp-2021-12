'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.JavaDocumentSymbolProvider = exports.activate = void 0;
const vscode = require("vscode");
const overview_1 = require("./webviews/overview");
const home_1 = require("./providers/home");
const highlight_1 = require("./providers/highlight");
const runAnalysis_1 = require("./functions/runAnalysis");
const GoHoverProvider_1 = require("./providers/GoHoverProvider");
const startup_1 = require("./functions/startup");
const sidePanelConfig_1 = require("./functions/sidePanelConfig");
const sidePanelSettings_1 = require("./functions/sidePanelSettings");
const sidePanelHelp_1 = require("./functions/sidePanelHelp");
const eventListener_1 = require("./functions/eventListener");
const fs_1 = require("fs");
const folder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];
console.log(folder);
var functions = [];
// TODO:
// [ ] - button to change software system
// [ ] - send two datas to backend
// [ ] - refresh method list when changing files or applying config (why doesn't 'greenIDE.run' work???)
// [ ] - set focus to line in code, not just input
// [ ] - shadow-implement backend data
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // create needed directories
    const fs = require('fs');
    fs.mkdirSync(folder + '/greenide/', { recursive: true });
    fs.mkdirSync(folder + '/greenide/csv/', { recursive: true });
    // auto start extension
    vscode.commands.executeCommand('greenIDE.run');
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "greenide" is now active!');
    // start extension
    let disposable = vscode.commands.registerCommand('greenIDE.run', async () => {
        // The code you place here will be executed every time your command is executed
        // check for new csv and parse methods / config elements
        (0, startup_1.startup)();
        // get data from backend (IMPLEMENT WHEN READY)
        // functions = runAnalysis(functions);
        // TEST suite, replace with avoe when BACKEND READY
        (0, runAnalysis_1.runAnalysis)(functions);
        // TEST suite
        var response = JSON.parse((0, fs_1.readFileSync)('/Users/ferris/PECK/SWP/swtp-2021-12/frontend/greenide/src/configurations/response.json', 'utf8'));
        console.log(response);
        // side panel segments loading
        const homePromise = sidePanelHome();
        const configsPromise = (0, sidePanelConfig_1.sidePanelConfigs)(context);
        const settingsPromise = (0, sidePanelSettings_1.sidePanelSettings)(context);
        const helpPromise = (0, sidePanelHelp_1.sidePanelHelp)(context);
        // ||
        await homePromise;
        await configsPromise;
        await settingsPromise;
        await helpPromise;
    });
    Promise.all([sidePanelHome(), (0, sidePanelConfig_1.sidePanelConfigs)(context), (0, sidePanelSettings_1.sidePanelSettings)(context), (0, sidePanelHelp_1.sidePanelHelp)(context)]);
    context.subscriptions.push(disposable);
    // This creates the side panel segment 'GreenIDE' where the user sees the found methods, 
    // refresh for new found methods and select items to highlight them
    async function sidePanelHome() {
        // Creates tree view for first segment of side panel, home of extension actions
        var homeTreeView = vscode.window.createTreeView("greenIDE-home", {
            treeDataProvider: new home_1.HomeProvider(functions)
        });
        // Set name for first segment
        homeTreeView.title = 'GREENIDE';
        homeTreeView.description = 'Refresh GreenIDE:';
        // When clicking on a method from tree
        let clickEvent = vscode.commands.registerCommand('greenIDE-home.click', (functionI) => {
            var line = functionI.location.range.start.line - 1;
            var character = functionI.location.range.start.character;
            var name = functionI.name;
            // Execute vscode commandto jump to location at (line,character)
            const functionPosition = new vscode.Position(line, character);
            vscode.window.activeTextEditor.selections = [new vscode.Selection(functionPosition, functionPosition)];
            vscode.commands.executeCommand("workbench.action.focusActiveEditorGroup");
            // TEST suite see if arguments pass
            console.log('Method: ' + name + ' - Line: ' + (line + 1) + ', Position: ' + character);
            console.log('');
            // Create Highlight object which stores provided data
            let testHighlight = new highlight_1.MethodHighlight(functionI.location.range.start.line, functionI.location.range.start.character, functionI.location.range.end.character);
            // Execute highlight with provided data
            testHighlight.decorate;
        });
        // When clicking on 'header', namely 'found methods'
        let clickEventAll = vscode.commands.registerCommand('greenIDE-home.clickAll', () => {
            // TEST suite see if arguments pass
            for (var j = 0; j < functions.length; j++) {
                console.log('Method: ' + functions[j].name
                    + ' - Line: ' + functions[j].location.range.start.line
                    + ', Position: ' + functions[j].location.range.start.character);
            }
            // Iterate over functions array to highlight each function with provided data
            for (var i = 0; i < functions.length; i++) {
                // Highlight each element from functions[i] at it's proper location
                let testHighlight = new highlight_1.MethodHighlight(functions[i].location.range.start.line, functions[i].location.range.start.character, functions[i].location.range.end.character);
                testHighlight.decorate;
            }
        });
        // Button to open overview of methods & data, many many statistics
        let overviewEvent = vscode.commands.registerCommand('greenIDE-home.overview', async () => {
            // Open webview 'OverView'
            overview_1.Overview.createOrShow(context.extensionUri);
        });
        context.subscriptions.push(clickEvent);
        context.subscriptions.push(clickEventAll);
        context.subscriptions.push(overviewEvent);
        context.subscriptions.push(homeTreeView);
    }
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ language: "java" }, new JavaDocumentSymbolProvider()));
    (0, eventListener_1.eventListener)(context);
    // Start Hover Provider to create hovers
    context.subscriptions.push(vscode.languages.registerHoverProvider({ language: "java" }, new GoHoverProvider_1.GoHoverProvider()));
}
exports.activate = activate;
// Implementation of documentSymbolProvider to find all parts of code containing 'kanzi.'
class JavaDocumentSymbolProvider {
    provideDocumentSymbols(document, token) {
        // Use in iteration to find kanzis
        var foundMethods = [];
        return new Promise((resolve) => {
            foundMethods = [];
            // Redunant functions saved for iteration
            var functionsR = [];
            functionsR = [];
            functions = [];
            var containedKanzis = [];
            var symbols = [];
            var containerNumber = 0;
            // SEVERAL KANZI LISTS TO OPERATE
            // – kanzilistFULL: original kanzi list, imported from file (e.g. JSON)
            // – kanzilistIMP: sliced off after last dot to find implementations
            //   – KanzilistIMPwD: kanzilistIMP without duplicates
            // – kanzilistMET: all the methods
            // – kanzilist: the implementations and their belonging methods
            // Full methodlist from CSV, to edit prefered methods: edit locatorList.json in workspace
            const fs = require('fs');
            var data = JSON.parse(fs.readFileSync(folder + '/greenide/locatorItems.json', 'utf8'));
            var kanzilistFULL = [];
            for (var n1 = 0; n1 < data.methods.length; n1++) {
                kanzilistFULL[n1] = JSON.stringify(data.methods[n1]);
            }
            // First sublist: slice at the last dot to check for implemenation
            // Second sublist: take second part after slice for methods
            var kanzilistIMP = []; // names for implementation
            var kanzilistMET = []; // names for methods
            for (var n2 = 0; n2 < kanzilistFULL.length; n2++) {
                var index = kanzilistFULL[n2].lastIndexOf('.');
                kanzilistIMP[n2] = kanzilistFULL[n2].slice(1, index);
                kanzilistMET[n2] = kanzilistFULL[n2].slice(index + 1, kanzilistFULL[n2].length - 3);
            }
            // Purge duplicates in kanzilistIMP
            let kanzilistIMPwD = [];
            kanzilistIMP.forEach((i) => {
                if (!kanzilistIMPwD.includes(i)) {
                    kanzilistIMPwD.push(i);
                }
            });
            // Two dimensional list of kanzi methods to find methods after implementation
            // kanzilist = [implemented][method]
            var kanzilist = [];
            for (var k = 0; k < kanzilistIMP.length; k++) {
                kanzilist.push([kanzilistIMP[k], kanzilistMET[k]]);
            }
            // MECHANIC
            // Find "kanzi." in document/code
            // for each line in code
            for (var i = 0; i < document.lineCount; i++) {
                // current line
                var line = document.lineAt(i);
                // loop 1: find kanzi implementations
                for (var temp = 0; temp < kanzilist.length; temp++) {
                    // if kanzi is in line ...
                    if (line.text.includes('import ' + kanzilist[temp][0])) {
                        containedKanzis.push(kanzilist[temp]);
                    }
                }
                // TODO: fix kanzi finding
                // Issue: second object in Hash32 too long and not correct
                // Loop 2: find objects / methods from imported kanzi
                for (var temp = 0; temp < containedKanzis.length; temp++) {
                    var impKanzi = containedKanzis[temp][0].slice(containedKanzis[temp][0].lastIndexOf('.') + 1, containedKanzis[temp][0].length);
                    // if kanzi is used ...
                    if (line.text.includes(' new ' + impKanzi + '(')) {
                        // if kanzi is a renamed object ...
                        if (line.text.includes('= new ' + impKanzi + '(')) {
                            // mark location of method
                            for (var j = 0; j < line.text.length; j++) {
                                if (!line.text.substring(j).includes('= new ' + impKanzi + '(')) {
                                    var k = 3;
                                    // check where name starts
                                    do {
                                        k++;
                                    } while (!line.text.substring(j - k - 1, j - 3).includes(' '));
                                    // Hash32 name = new hash32(99) // j = 16, k = 6 --> substring(16-6,16-2) = substring(11,15) = 'name'
                                    var target = line.text.substring(j - k, j - 3);
                                    // search for target
                                    var iCopy = i + 1; // logically stay at line i but search in segment between brackets
                                    var bracketCounter = 0; // to count brackets for instance
                                    do {
                                        // search for method application, like target.hash(0)
                                        if (document.lineAt(iCopy).text.includes(target + '.' + containedKanzis[temp][1] + '(')) {
                                            for (var j2 = 0; j2 < document.lineAt(iCopy).text.length; j2++) {
                                                if (!document.lineAt(iCopy).text.substring(j2).includes(target + '.' + containedKanzis[temp][1] + '(')) {
                                                    symbols.push({
                                                        // Substring only grabbing kanzi method name without braces
                                                        // name: line.text.substr(j-1, (k-1) - (j-1)),
                                                        name: impKanzi + '.' + containedKanzis[temp][1] + '()',
                                                        method: containedKanzis[temp][0] + '.' + containedKanzis[temp][1],
                                                        runtime: 0,
                                                        energy: 0,
                                                        kind: vscode.SymbolKind.Object,
                                                        containerName: containerNumber.toString(),
                                                        location: new vscode.Location(document.uri, new vscode.Range(new vscode.Position(iCopy + 1, j2 + target.length), new vscode.Position(iCopy + 1, j2 + (target + '.' + containedKanzis[temp][1]).length - 1)))
                                                    });
                                                    foundMethods[containerNumber] = kanzilist[temp][1];
                                                    containerNumber++;
                                                    break;
                                                }
                                            }
                                        }
                                        // Count brackets to ensure we are still inside possible instance of target
                                        if (document.lineAt(iCopy).text.includes('{')) {
                                            bracketCounter++;
                                        }
                                        if (document.lineAt(iCopy).text.includes('}')) {
                                            bracketCounter--;
                                        }
                                        iCopy++;
                                    } while (bracketCounter >= 0);
                                }
                            }
                        }
                        else {
                            // mark location of method
                            for (var j = 0; j < line.text.length; j++) {
                                if (!line.text.substring(j).includes(' new ' + impKanzi + '(')) {
                                    symbols.push({
                                        // Substring only grabbing kanzi method name without braces
                                        // name: line.text.substr(j-1, (k-1) - (j-1)),
                                        name: impKanzi + '()',
                                        method: containedKanzis[temp][0] + '.' + containedKanzis[temp][1],
                                        runtime: 0,
                                        energy: 0,
                                        kind: vscode.SymbolKind.Method,
                                        containerName: containerNumber.toString(),
                                        location: new vscode.Location(document.uri, new vscode.Range(new vscode.Position(i + 1, j + 4), new vscode.Position(i + 1, j + impKanzi.length + 4)))
                                    });
                                    foundMethods[containerNumber] = kanzilist[temp][1];
                                    containerNumber++;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            // Save symbols (all kanzi methods with metadata)
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
                // if there was no duplicate while iterating in functionsWD ...
                if (checkDup === false) {
                    // ... add this element from functions to functionsWD
                    functions.push(functionsR[j]);
                }
                // reset checkDup for next iteration
                checkDup = false;
            }
            resolve(symbols);
        });
    }
}
exports.JavaDocumentSymbolProvider = JavaDocumentSymbolProvider;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
// For file reading, not purpose though
function callback(arg0, json, arg2, callback) { }
//# sourceMappingURL=extension.js.map