"use strict";
// This creates the side panel segment 'Settings' to change config items or locator items
Object.defineProperty(exports, "__esModule", { value: true });
exports.sidePanelSettings = void 0;
const vscode = require("vscode");
const settings_1 = require("../providers/settings");
const folder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];
function sidePanelSettings(context) {
    // creates tree view for third segment of side panel
    var helpTreeView = vscode.window.createTreeView("greenIDE-settings", {
        treeDataProvider: new settings_1.SettingsProvider
    });
    // Set name for third segment
    helpTreeView.title = 'SETTINGS';
    helpTreeView.message = 'Click to Edit ...';
    // Generic button action, provided document is oepned
    let clickEvent = vscode.commands.registerCommand('greenIDE-settings.click', (openPath) => {
        // Open the link when clicking item number nr
        vscode.workspace.openTextDocument(openPath).then(doc => {
            vscode.window.showTextDocument(doc);
        });
    });
    context.subscriptions.push(clickEvent);
    context.subscriptions.push(helpTreeView);
}
exports.sidePanelSettings = sidePanelSettings;
//# sourceMappingURL=sidePanelSettings.js.map