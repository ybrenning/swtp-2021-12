// Provider for third tab in side panel, help
// instructions on how to use greenIDE, commands, links etc.

import * as vscode from 'vscode';

export class HelpProvider implements vscode.TreeDataProvider<HelpItem> {
    onDidChangeTreeData?: vscode.Event<HelpItem | null | undefined> | undefined;

    // Tree for help segment
    data: HelpItem[];

    // Set the tree elements for side panel
    constructor() {

        // Create three items
        this.data = [
            new HelpItem('[↪︎] GitLab', 0),
            new HelpItem('[↪︎] How To Use', 1),
            new HelpItem('[↪︎] Contact Us', 2)
        ];
    }

    getTreeItem(element: HelpItem): vscode.TreeItem | Thenable<vscode.TreeItem> { return element; }
    getChildren(): vscode.ProviderResult<HelpItem[]> { return this.data; }
}

// Class to create each item
class HelpItem extends vscode.TreeItem {

    constructor(label: string, nr: number) {

        // Set the label for each element
        super(label);

        // Depending on which item, execute different command
        switch (nr) {
            case 0:
                this.command = {
                    title: "Help Item",
                    command: "greenIDE-help.click",
                    arguments: ['https://git.informatik.uni-leipzig.de/swtp-21-22/swt-p-ws-2020-2021/swtp-2021-12']
                };
                break;
            case 1:
                this.command = {
                    title: "Help Item",
                    command: "greenIDE-help.click",
                    arguments: ['https://sites.google.com/view/eonar/help']
                };
                break;
            case 2:
                this.command = {
                    title: "Help Item",
                    command: "greenIDE-help.click",
                    arguments: ['https://sites.google.com/view/eonar/contact']
                };
                break;
            default:
                break;
        }
    }

    contextValue = 'treeItem';
}
