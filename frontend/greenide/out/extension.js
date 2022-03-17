// TODO: Patchlist / History
/*
[X] 1.0 - MVP
[X] 1.1 - further functional things
1.2 - side panel basics (show methods, toggle highlighting, select configuration)
[X] 1.2.1 - kanzi locator
[X] 1.2.2 - side panel show all found methods
[X] 1.2.3 - click on side panel method to jump to location
    [X] 1.2.3.1 - reset list of methods when opening new file
[X] 1.2.4 - toggle highlighting at specific / all methods (generic color yellow)
[X] 1.2.5 - complete side panel
1.3 - Configs Side Panel
[X] 1.3.1 - Select and save config in JSON
[X] 1.3.2 - save and manage favorites (0 is default, 1+ saved favs)
[X] 1.3.3 - see current config from JSON in side panel
[X] 1.3.4 - See List of Saved Configs
[X] 1.3.5 - Settings Section, Edit configItems.json (any checkboxable Items) and locatorItems.json (which methods to find)
1.4 - Backend Communication
[ ] 1.4.1 - pressing button in home segment --> save methods with config in JSON to send
[ ] 1.4.2 - send/receive JSON via backend api
[ ] 1.4.3 - send/receive 2 JSONs (for comparison, default send 2 with second set to 0 if no comparison wanted)
            (will be used later in overview webview)
1.5 - apply response
[ ] - 1.5.1 - apply Respose data to each method
[ ] - 1.5.2 - color code depending on method data
[ ] - 1.5.3 - bugfixes with highlight
    [ ] - 1.5.3.1 - reset highlights when clicking on item again / or maybe 'reset'-button
    [ ] - 1.5.3.2 - reset methods in side panel when switching already opened files
[ ] - 1.5.4 - Hover text with data
1.6 - Overview webview
[ ] - 1.6.1 - display all results in webview from side panel
[ ] - 1.6.2 - display diagrams with distribution in webview
[ ] - 1.6.3 - apply different configs to methods in webview
1.7 - Cleanup and minor issues / tuning
[ ] - 1.7.0 - Minor Fixes (Refresh found methods, reset highlighting, ...)
[ ] - 1.7.1 - Parse into configList.json / locatorList.json from .csv file
[ ] - 1.7.2 - Refactoring / outsource functionalities to new classes
[ ] - 1.7.3 - rename all kanzi occurences to genereic method names
[ ] - 1.7.4 - Remove test cases / comments
*/
/*
TODO: open ISSUES
[ ] - refresh methods when switching file
[ ] - display configs in webview on startup / without button, or only one print when button pressed
[X] - click multiple items in webview without reloading
[X] - webview buttons cause exponential buffer (see debug printing)
[ ] - refactoring
*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const configMenu_1 = require("./webviews/configMenu");
const overview_1 = require("./webviews/overview");
const home_1 = require("./providers/home");
const configs_1 = require("./providers/configs");
const help_1 = require("./providers/help");
const highlight_1 = require("./providers/highlight");
const settings_1 = require("./providers/settings");
const folder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];
/* variable declarations for use */
// use in iteration to find kanzis
var foundMethods = [];
// functionsWD = functions /wo duplicates
var functions = [];
var sendFunctions;
// old data
var function1Data;
var function2Data;
var function3Data;
/* Main Extension */
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // auto start extension
    vscode.commands.executeCommand('greenIDE.run');
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "greenide" is now active!');
    // TEST suite
    console.log('TEST START');
    // start extension
    let disposable = vscode.commands.registerCommand('greenIDE.run', () => {
        // The code you place here will be executed every time your command is executed
        // Starts procedure and updates webview panel
        runAnalysis();
        // side panel segments loading
        sidePanelHome();
        // TEST suite
        console.log('TEST ASYNC B');
        sidePanelConfigs();
        sidePanelSettings();
        sidePanelHelp();
        // old webview panel
        // WebviewPanel.createOrShow(context.extensionUri);
    });
    context.subscriptions.push(disposable);
    // This creates the side panel segment 'GreenIDE' where the user sees the found methods, refresh for new found methods and select items
    // to highlight them
    // TODO: tune highlighting
    // [X] - make new colors / borders, experiment with decoration
    // [ ] - reset for every new item (maybe highlight.reset() option at beginning of each item/clickevent), Maybe reset context.subscriptions
    // [X] - parse complete functions[i] from home.ts, not only name,line,char
    // [X] - use property symbolkind.method or symbolkind.object to identify proper range (to end of name) 
    function sidePanelHome() {
        // creates tree view for first segment of side panel, home of extension actions
        var homeTreeView = vscode.window.createTreeView("greenIDE-home", {
            treeDataProvider: new home_1.HomeProvider(functions)
        });
        // Set name for first segment
        homeTreeView.title = 'GREENIDE';
        homeTreeView.description = 'Refresh Methods:';
        // TEST suite
        console.log('TEST ASYNC A');
        // when clicking on a method from tree
        let clickEvent = vscode.commands.registerCommand('greenIDE-home.click', (functionI) => {
            var line = functionI.location.range.start.line - 1;
            var character = functionI.location.range.start.character;
            var name = functionI.name;
            // execute vscode commandto jump to location at (line,character)
            const functionPosition = new vscode.Position(line, character);
            vscode.window.activeTextEditor.selections = [new vscode.Selection(functionPosition, functionPosition)];
            vscode.commands.executeCommand("workbench.action.focusActiveEditorGroup");
            // TEST suite see if arguments pass
            console.log('Method: ' + name + ' - Line: ' + (line + 1) + ', Position: ' + character);
            console.log('');
            // Create Highlight object which stores provided data
            let testHighlight = new highlight_1.MethodHighlight(functionI.location.range.start.line, functionI.location.range.start.character, functionI.location.range.end.character);
            // execute highlight with provided data
            testHighlight.decorate;
        });
        // TEST suite
        console.log('TEST ASYNC C');
        // when clicking on 'header', namely 'found methods'
        let clickEventAll = vscode.commands.registerCommand('greenIDE-home.clickAll', () => {
            // TEST suite see if arguments pass
            for (var j = 0; j < functions.length; j++) {
                console.log('Method: ' + functions[j].name + ' - Line: ' + functions[j].location.range.start.line + ', Position: ' + functions[j].location.range.start.character);
            }
            console.log('');
            // Iterate over functions array to highlight each function with provided data
            for (var i = 0; i < functions.length; i++) {
                // Highlight each element from functions[i] at it's proper location
                let testHighlight = new highlight_1.MethodHighlight(functions[i].location.range.start.line, functions[i].location.range.start.character, functions[i].location.range.end.character);
                testHighlight.decorate;
            }
        });
        // TEST suite
        console.log('TEST ASYNC D');
        // Button to open overview of methods & data, many many statistics
        let overviewEvent = vscode.commands.registerCommand('greenIDE-home.overview', async () => {
            // open webview 'OverView'
            overview_1.Overview.createOrShow(context.extensionUri);
        });
        // TEST suite
        console.log('TEST ASYNC E');
        context.subscriptions.push(clickEvent);
        context.subscriptions.push(clickEventAll);
        context.subscriptions.push(overviewEvent);
        context.subscriptions.push(homeTreeView);
        // TEST suite
        console.log('TEST ASYNC F');
    }
    // This creates the side panel segment 'Configs' where the user can see which config elements are active
    // there's also an element to click and open a webview to change the config with checkboxes or manage saved favorites / save a new favorite
    function sidePanelConfigs() {
        // config data (default config 0)
        var config = [];
        // read current config
        const fs = require('fs');
        var result = JSON.parse(fs.readFileSync(folder + '/configurations/configuration.json', 'utf8'));
        config = result.config[0].config;
        // creates tree view for second segment of side panel, place for configs
        var configsTreeView = vscode.window.createTreeView("greenIDE-configs", {
            treeDataProvider: new configs_1.ConfigsProvider(config)
        });
        // Set name for second segment
        configsTreeView.title = 'CONFIGURATIONS';
        // Button to open menu for configs, to select configs, save favorites or delete favorites
        let clickEvent = vscode.commands.registerCommand('greenIDE-config.menu', () => {
            // open webview 'ConfigMenu'
            configMenu_1.ConfigMenu.createOrShow(context.extensionUri);
        });
        context.subscriptions.push(clickEvent);
        context.subscriptions.push(configsTreeView);
    }
    // This creates the side panel segment 'Settings' to change config items or locator items
    function sidePanelSettings() {
        // creates tree view for third segment of side panel
        var helpTreeView = vscode.window.createTreeView("greenIDE-settings", {
            treeDataProvider: new settings_1.SettingsProvider
        });
        // Set name for third segment
        helpTreeView.title = 'SETTINGS';
        helpTreeView.message = 'Click to Edit ...';
        // Generic button action, provided document is oepned
        let clickEvent = vscode.commands.registerCommand('greenIDE-settings.click', (openPath) => {
            // open the link when clicking item number nr
            vscode.workspace.openTextDocument(openPath).then(doc => {
                vscode.window.showTextDocument(doc);
            });
        });
        context.subscriptions.push(clickEvent);
        context.subscriptions.push(helpTreeView);
    }
    // This creates the side panel segment 'Help' which provides three elements to get
    // further into our extension, get help in a Q&A or contact us
    function sidePanelHelp() {
        // creates tree view for fourth segment of side panel, get instructions, commands, help links etc
        var helpTreeView = vscode.window.createTreeView("greenIDE-help", {
            treeDataProvider: new help_1.HelpProvider
        });
        // Set name for fourth segment
        helpTreeView.title = 'HELP';
        // Generic button action, provided link is opened
        let clickEvent = vscode.commands.registerCommand('greenIDE-help.click', (link) => {
            // open the link when clicking item number nr
            vscode.env.openExternal(vscode.Uri.parse(link));
        });
        context.subscriptions.push(clickEvent);
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
    // read current config
    const fs = require('fs');
    var result = JSON.parse(fs.readFileSync(folder + '/configurations/configuration.json', 'utf8'));
    var config = [];
    if (result.config[0] === undefined) {
        config = [];
    }
    else {
        config = result.config[0].config;
    }
    // TESt suite
    console.log('TEST CONFIG EMPFANG');
    console.log(config);
    // define collection for data
    var obj = {
        functions: [],
        config: []
    };
    console.log('START READER');
    for (let i = 0; i < config.length; i++) {
        obj.config.push(config[i]);
    }
    for (let i = 0; i < functions.length; i++) {
        obj.functions.push(functions[i].name);
    }
    // TEST suite
    console.log('TEST OBJ');
    console.log(obj);
    // TEST suite
    console.log('METHODS:');
    for (let i = 0; i < functions.length; i++) {
        console.log(functions[i].method);
    }
    // TODO: continue with parsing for backend, write file etc.
}
// Implementation of documentSymbolProvider to find all parts of code containing 'kanzi.'
class JavaDocumentSymbolProvider {
    provideDocumentSymbols(document, token) {
        return new Promise((resolve) => {
            foundMethods = [];
            // redunant functions saved for iteration
            var functionsR = [];
            functionsR = [];
            functions = [];
            var containedKanzis = [];
            var symbols = [];
            var containerNumber = 0;
            // TODO: get methods from dynamic JSON, not only hardcoded JSON
            // SEVERAL KANZI LISTS TO OPERATE
            // – kanzilistFULL: original kanzi list, imported from file (e.g. JSON)
            // – kanzilistIMP: sliced off after last dot to find implementations
            //   – KanzilistIMPwD: kanzilistIMP without duplicates
            // – kanzilistMET: all the methods
            // – kanzilist: the implementations and their belonging methods
            // Full methodlist from CSV, to edit prefered methods: edit locatorList.json in workspace
            const fs = require('fs');
            var data = JSON.parse(fs.readFileSync(folder + '/configurations/locatorItems.json', 'utf8'));
            var kanzilistFULL = [];
            for (var n1 = 0; n1 < data.methods.length; n1++) {
                kanzilistFULL[n1] = JSON.stringify(data.methods[n1]);
            }
            // first sublist: slice at the last dot to check for implemenation
            // second sublist: take second part after slice for methods
            var kanzilistIMP = []; // names for implementation
            var kanzilistMET = []; // names for methods
            for (var n2 = 0; n2 < kanzilistFULL.length; n2++) {
                var index = kanzilistFULL[n2].lastIndexOf('.');
                kanzilistIMP[n2] = kanzilistFULL[n2].slice(1, index);
                kanzilistMET[n2] = kanzilistFULL[n2].slice(index + 1, kanzilistFULL[n2].length - 3);
            }
            // purge duplicates in kanzilistIMP
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
            // TODO: find implemented Kanzi and the location of their method implementation
            // [X] Kanzi Implementation detected
            // [ ] Corresponding Methods found (also for created Objects)
            /*
            pseudocode to find both objects and plain methods from imported kanzi:

            bracketcounter = 0
            if (before kanziMET[k] is 'new ') {
                var target = name
                    where name is extracted from = ..% name = kanziMET[k](%..
                do {
                    search for target
                    if (opening bracket is found): bracketcounter +1
                    if (closing bracket is found): bracketcounter -1
                } while (bracketcounter >= 0)
            } else {
                search for kanziMET[k]
            }
            */
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
                // loop 2: find objects / methods from imported kanzi
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
                                                        name: impKanzi + containedKanzis[temp][1] + '()',
                                                        method: containedKanzis[temp][0] + '.' + containedKanzis[temp][1],
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
                                        // count brackets to ensure we are still inside possible instance of target
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
                // check if for every entry in functionsWD ...
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
// For file reading, not purpose though
function callback(arg0, json, arg2, callback) { }
//# sourceMappingURL=extension.js.map