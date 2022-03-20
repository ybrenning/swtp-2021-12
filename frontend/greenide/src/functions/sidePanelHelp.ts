// This creates the side panel segment 'Help' which provides three elements to get
// further into our extension, get help in a Q&A or contact us

import * as vscode from 'vscode';
import { HelpProvider } from '../providers/help';
import { getFolder } from './getFolder';
const folder = getFolder();

export async function sidePanelHelp(context: vscode.ExtensionContext) {
    // Creates tree view for fourth segment of side panel, get instructions, commands, help links etc
    var helpTreeView = vscode.window.createTreeView("greenIDE-help", {
        treeDataProvider: new HelpProvider
    });

    // Set name for fourth segment
    helpTreeView.title = 'HELP';

    // Generic button action, provided link is opened
    let clickEvent = vscode.commands.registerCommand('greenIDE-help.click', (link: string) => {

        // Open the link when clicking item number nr
        vscode.env.openExternal(vscode.Uri.parse(link));
    });

    context.subscriptions.push(clickEvent);
    context.subscriptions.push(helpTreeView);
}