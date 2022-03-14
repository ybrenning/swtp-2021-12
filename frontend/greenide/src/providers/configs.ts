// provider for second tab in side panel, configs
// drop down / tree view for all methods to apply, save methods in favorites

import * as vscode from 'vscode';

export class ConfigsProvider implements vscode.TreeDataProvider<ConfigItem> {
    
    onDidChangeTreeData?: vscode.Event<ConfigItem | null | undefined> | undefined;

    // Tree for config segment
    data: ConfigItem[];

    // Set the tree elements for side panel
    constructor() {

        // TODO: 
        // [ ] - code to read config.json
        // [ ] - config panel freezes on startup -> fix (caused when loop for hardcode config array is in / collapsable tree is in)
        // structure:
        /*
        [ ] - active config gets number 0 and is displayed
        [ ] - every saved config gets number 1 and up
        [ ] - configs can be browsed in webview, maybe dropdown menu
        [ ] - saved configs can be deleted with a button (command to remove whole block of number x in config.json)
        */

        // TEST suite HARDCODE
        var configs = ['ROFL', 'TEX'];

        // read the config.json and get current active config elements
        var sendData = [];
        for (var j = 0; j<configs.length; j++) {
            sendData.push(new ConfigItem(configs[j], undefined));
        }

        // the data, consisting of two elements
        //  - the tree itself with the current active config elements
        //  - and the button to toggle webview
        this.data = [
            new ConfigItem('Current Config:', sendData),
            new ConfigItem('Open Config Menu')
        ];
    }
    
    getTreeItem(element: ConfigItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    
    getChildren(element?: ConfigItem | undefined): vscode.ProviderResult<ConfigItem[]> {
        
        if (element === undefined) {
            return this.data;
        }
        return element.children;
    }
}

class ConfigItem extends vscode.TreeItem {
    
    // initialize variables for constructor
    children: ConfigItem[] | undefined;

    constructor(label: string, children?: ConfigItem[]) {

        super(
            label,
            children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
        );

        // variables for each ConfigItem
        this.children = children;

        // the command that is executed when clicking on the HomeItem (if it is a child)
        if (this.label === 'Open Config Menu') {
            this.command = {
                title: "Config Menu",
                command: "greenIDE-config.menu"
            };
        }
    }

    contextValue = 'treeItem';
}