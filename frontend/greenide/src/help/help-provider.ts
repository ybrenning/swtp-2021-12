// For Sidepanel tree segment 'help'

import * as vscode from 'vscode';
import { HelpItem } from './help-item';

export class HelpProvider implements vscode.TreeDataProvider<HelpItem> {

    constructor(private context: vscode.ExtensionContext) {
    }

    getTreeItem(element: HelpItem): HelpItem {
        return element;
    }

    getChildren(element?: HelpItem): Thenable<HelpItem[]> {
        if (!element) {
            const infoElement = new HelpItem('Info & Download', vscode.TreeItemCollapsibleState.None, {
                command: 'vscode.open', title: 'Extension Information & Download',
                arguments: [vscode.Uri.parse('https://sites.google.com/view/eonar/home')]
            }, '$(info)');
            const helpElement = new HelpItem('Help', vscode.TreeItemCollapsibleState.None, {
                command: 'vscode.open', title: 'Get Help',
                arguments: [vscode.Uri.parse('https://sites.google.com/view/eonar/help')]
            }, '$(info)');
            const contactElement = new HelpItem('Contact Us', vscode.TreeItemCollapsibleState.None, {
                command: 'vscode.open', title: 'Contact Us',
                arguments: [vscode.Uri.parse('https://sites.google.com/view/eonar/')]
            }, '$(info)');
            return Promise.resolve([infoElement, helpElement, contactElement]);
        }

        return Promise.resolve([]);
    }

    registerProviders() {
        const help = vscode.window.createTreeView('greenIDE.help', {
            treeDataProvider: this
        });
        this.context.subscriptions.push(help);
    }
}