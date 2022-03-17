// Provider for settings segment
// Just two clickable elements to either parse another configItems.json or locatorItems.json

import * as vscode from 'vscode';

const folder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];

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

        // Depending on which item, execute different command
        switch (nr) {
            case 0:
                this.command = {
                    title: "Settings Item",
                    command: "greenIDE-settings.click",
                    arguments: [folder + '/configurations/configItems.json']
                };
                break;
            case 1:
                this.command = {
                    title: "Settings Item",
                    command: "greenIDE-settings.click",
                    arguments: [folder + '/configurations/locatorItems.json']
                };
                break;
            default:
                break;
        }
    }

    contextValue = 'treeItem';
}
