// provider for first tab in side panel, home
// start/reload greenIDE, see found methods, get data, activate syntax highlighting

import * as vscode from 'vscode';
import { Hover, HoverProvider, ProviderResult } from 'vscode';
import { MessagePort, TransferListItem } from 'worker_threads';
import { getNonce } from '../getNonce';


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
                sendData.push(new HomeItem(functions[j].name, undefined, functions[j].location.range.start.line-1, functions[j].location.range.start.character));
            }

            // show methods or ...
            this.data = [new HomeItem('Found Methods:', sendData)];

        } else {

            // prompt to run/reload
            this.data = [new HomeItem('Run or Reload Extension')];
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
    character: number | undefined;

    constructor(label: string, children?: HomeItem[], line?: number, character?: number) {

        super(
            label,
            children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
        );

        // variables for each HomeItem
        this.children = children;
        this.line = line;
        this.character = character;

        // the command that is executed when clicking on the HomeItem (if it is a child)
        if (line) {
            this.command = {
                title: "Reveal Method",
                command: "greenIDE-home.click",
                arguments: [line,character]
            },
            {
                title: "Highlight Method",
                command: "greenIDE-home.highlight",
                arguments: [line,character]
            };
        } else {
            this.command = {
                title: "Reveal Method",
                command: "greenIDE-home.clickAll",
            };
        }
    }

    contextValue = 'treeItem';
}