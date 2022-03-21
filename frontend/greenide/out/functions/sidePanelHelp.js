"use strict";
// This creates the side panel segment 'Help' which provides three elements to get
// further into our extension, get help in a Q&A or contact us
Object.defineProperty(exports, "__esModule", { value: true });
exports.sidePanelHelp = void 0;
const vscode = require("vscode");
const help_1 = require("../providers/help");
async function sidePanelHelp(context) {
    // Creates tree view for fourth segment of side panel, get instructions, commands, help links etc
    var helpTreeView = vscode.window.createTreeView("greenIDE-help", {
        treeDataProvider: new help_1.HelpProvider
    });
    // Set name for fourth segment
    helpTreeView.title = 'HELP';
    // Generic button action, provided link is opened
    let clickEvent = vscode.commands.registerCommand('greenIDE-help.click', (link) => {
        // Open the link when clicking item number nr
        vscode.env.openExternal(vscode.Uri.parse(link));
    });
    context.subscriptions.push(clickEvent);
    context.subscriptions.push(helpTreeView);
}
exports.sidePanelHelp = sidePanelHelp;
//# sourceMappingURL=sidePanelHelp.js.map