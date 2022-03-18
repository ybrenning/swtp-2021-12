// Provider for first tab in side panel, home
// Start/reload greenIDE, see found methods, get data, activate syntax highlighting

import * as vscode from 'vscode';

export class HomeProvider implements vscode.TreeDataProvider<HomeItem> {
    onDidChangeTreeData?: vscode.Event<HomeItem | null | undefined> | undefined;

    // Tree for home segment
    data: HomeItem[];

    // Set the tree elements for side panel
    constructor(functions: { 
        name: string; 
        method: string; 
        kind: vscode.SymbolKind; 
        containerName: string; 
        location: vscode.Location; 
    }[]) {
        // If there are functions
        if (functions.length > 0) {
            // Collect all functions found
            var sendData = [];
            for (var j = 0; j<functions.length; j++) {
                sendData.push(new HomeItem(functions[j].name, undefined, functions[j]));
            }

            // Show methods or ...
            this.data = [
                new HomeItem('Found Methods:', sendData),
                new HomeItem('Highlight All Methods'),
                new HomeItem('Detailed Statistics')
            ];

        } else {
            // Prompt to run/reload
            this.data = [
                new HomeItem('Run or Reload Extension')
            ];
        }
    }

    getTreeItem(element: HomeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: HomeItem | undefined): vscode.ProviderResult<HomeItem[]> {
        if (element === undefined) {
            return this.data;
        }

        return element.children;
    }
}

class HomeItem extends vscode.TreeItem {
    // Initialize variables for constructor
    children: HomeItem[] | undefined;
    line: number | undefined;

    constructor(label: string, children?: HomeItem[], functionI?: { 
        name: string; 
        method: string; 
        kind: vscode.SymbolKind; 
        containerName: string; 
        location: vscode.Location; 
    }) {
        super(
            label,
            children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
        );

        // Variables for each HomeItem
        this.children = children;
        this.line = functionI?.location.range.start.line;

        // The command that is executed when clicking on the HomeItem (if it is a child)
        if (this.line) {
            this.command = {
                title: "Highlight Method",
                command: "greenIDE-home.click",
                arguments: [functionI]
            };
        } else if (label.match('Detailed Statistics')) {
            this.command = {
                title: "Open Details",
                command: "greenIDE-home.overview",
            };
        } else if (label.match('Highlight All Methods')) {
            this.command = {
                title: "Highlight All Methods",
                command: "greenIDE-home.clickAll",
            };
        }
    }

    contextValue = 'treeItem';
}
