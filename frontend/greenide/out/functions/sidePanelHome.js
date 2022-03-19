"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sidePanelHome = void 0;
const vscode = require("vscode");
const extension_1 = require("../extension");
const highlight_1 = require("../providers/highlight");
const home_1 = require("../providers/home");
const overview_1 = require("../webviews/overview");
// This creates the side panel segment 'GreenIDE' where the user sees the found methods, 
// refresh for new found methods and select items to highlight them
async function sidePanelHome(context) {
    var functions = (0, extension_1.getFunctions)();
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
        let testHighlight = new highlight_1.MethodHighlight(functionI.location.range.start.line, functionI.location.range.start.character, functionI.location.range.end.character, functionI.runtime[1], functionI.energy[1]);
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
            let testHighlight = new highlight_1.MethodHighlight(functions[i].location.range.start.line, functions[i].location.range.start.character, functions[i].location.range.end.character, functions[i].runtime[1], functions[i].energy[1]);
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
exports.sidePanelHome = sidePanelHome;
//# sourceMappingURL=sidePanelHome.js.map