// Provider for second tab in side panel, configs
// drop down / tree view for all methods to apply, save methods in favorites

import * as vscode from 'vscode';

export class ConfigsProvider implements vscode.TreeDataProvider<ConfigItem> {

    onDidChangeTreeData?: vscode.Event<ConfigItem | null | undefined> | undefined;

    // Tree for config segment
    data: ConfigItem[];

    // Set the tree elements for side panel
    constructor(config: string[]) {

        // read the config.json and get current active config elements
        var sendData = [];
        for (var j = 0; j < config.length; j++) {
            sendData.push(new ConfigItem(config[j], undefined));
        }

        // The data, consisting of two elements
        //  - the tree itself with the current active config elements
        //  - and the button to toggle webview
        this.data = [
            new ConfigItem('Current Config:', sendData),
            new ConfigItem('Open Config Menu')
        ];
    }

    getTreeItem(element: ConfigItem): vscode.TreeItem | Thenable<vscode.TreeItem> { return element; }
    getChildren(element?: ConfigItem | undefined): vscode.ProviderResult<ConfigItem[]> {
        if (element === undefined) { return this.data; }
        return element.children;
    }
}

class ConfigItem extends vscode.TreeItem {
    // Initialize variables for constructor
    children: ConfigItem[] | undefined;

    constructor(label: string, children?: ConfigItem[]) {
        super(label, children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded);

        // Variables for each ConfigItem
        this.children = children;

        // The command that is executed when clicking on the HomeItem (if it is a child)
        if (this.label === 'Open Config Menu') {
            this.command = {
                title: "Config Menu",
                command: "greenIDE-config.menu"
            };
        }
    }

    contextValue = 'treeItem';
}
