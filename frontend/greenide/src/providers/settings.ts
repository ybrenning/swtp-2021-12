// provider for settings segment
// just two clickable elements to either parse another configItems.json or locatorItems.json

import * as vscode from 'vscode';

export class SettingsProvider implements vscode.TreeDataProvider<SettingsItem> {
    
    onDidChangeTreeData?: vscode.Event<SettingsItem | null | undefined> | undefined;

    // Tree for help segment
    data: SettingsItem[];

    // Set the tree elements for side panel
    constructor() {

        // Create three items
        this.data = [
            new SettingsItem('Config Elements',0),
            new SettingsItem('Locator Elements',1)
        ];
    }
    
    getTreeItem(element: SettingsItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    
    getChildren(): vscode.ProviderResult<SettingsItem[]> {
        return this.data;
    }
}

// Class to create each item
class SettingsItem extends vscode.TreeItem {

    constructor(label: string, nr: number) {

        // Set the label for each element
        super(label);

        // depending on which item, execute different command
        switch (nr) {
            case 0:
                this.command = {
                    title: "Settings Item",
                    command: "greenIDE-settings.click",
                    arguments: ['./configurations/configItems.json']
                };
                break;
            case 1:
                this.command = {
                    title: "Settings Item",
                    command: "greenIDE-settings.click",
                    arguments: ['./configurations/locatorItems.json']
                };
                break;
            default:
                break;
        }
    }

    contextValue = 'treeItem';
}