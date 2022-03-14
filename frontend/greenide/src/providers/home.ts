// provider for first tab in side panel, home
// start/reload greenIDE, see found methods, get data, activate syntax highlighting

import * as vscode from 'vscode';

export class HomeProvider implements vscode.TreeDataProvider<HomeItem> {

    onDidChangeTreeData?: vscode.Event<HomeItem | null | undefined> | undefined;

    // Tree for home segment
    data: HomeItem[];

    // Set the tree elements for side panel
    constructor(functions: { name: string; kind: vscode.SymbolKind; containerName: string; location: vscode.Location; }[]) {

        // if there are functions
        if (functions.length > 0) {

            // collect all functions found
            var sendData = [];
            for (var j = 0; j<functions.length; j++) {
                sendData.push(new HomeItem(functions[j].name, undefined, functions[j]));
            }

            // show methods or ...
            this.data = [
                new HomeItem('Found Methods:', sendData),
                new HomeItem('Detailed Statistics')
            ];

        } else {

            // prompt to run/reload
            this.data = [
                new HomeItem('Run or Reload Extension'),
                new HomeItem('Detailed Statistics')
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

    // initialize variables for constructor
    children: HomeItem[] | undefined;
    line: number | undefined;

    constructor(label: string, children?: HomeItem[], functionI?: { name: string; kind: vscode.SymbolKind; containerName: string; location: vscode.Location; }) {

        super(
            label,
            children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
        );

        // variables for each HomeItem
        this.children = children;
        this.line = functionI?.location.range.start.line;

        // the command that is executed when clicking on the HomeItem (if it is a child)
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
        } else {
            this.command = {
                title: "Highlight All Methods",
                command: "greenIDE-home.clickAll",
            };
        }
    }

    contextValue = 'treeItem';
}