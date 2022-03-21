// This creates the side panel segment 'Settings' to change config items or locator items

import * as vscode from 'vscode';
import { SettingsProvider } from '../providers/settings';

export async function sidePanelSettings(context: vscode.ExtensionContext) {

    // creates tree view for third segment of side panel
    var helpTreeView = vscode.window.createTreeView("greenIDE-settings", {
        treeDataProvider: new SettingsProvider
    });

    // Set name for third segment
    helpTreeView.title = 'SETTINGS';
    helpTreeView.message = 'Click to Edit ...';

    // Generic button action, provided document is oepned
    let clickEvent = vscode.commands.registerCommand('greenIDE-settings.click', (openPath: string) => {
        // Open the link when clicking item number nr
        vscode.workspace.openTextDocument(openPath).then(doc => {
            vscode.window.showTextDocument(doc);
        });
    });

    context.subscriptions.push(clickEvent);
    context.subscriptions.push(helpTreeView);
}