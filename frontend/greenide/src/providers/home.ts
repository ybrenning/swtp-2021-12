// provider for first tab in side panel, home
// start/reload greenIDE, see found methods, get data, activate syntax highlighting

import * as vscode from 'vscode';
import { Hover, HoverProvider, ProviderResult } from 'vscode';
import { MessagePort, TransferListItem } from 'worker_threads';


export class HomeProvider implements vscode.TreeDataProvider<HomeItem> {

    onDidChangeTreeData?: vscode.Event<HomeItem | null | undefined> | undefined;

    data: HomeItem[];

    constructor(functions: { name: string; kind: vscode.SymbolKind; containerName: string; location: vscode.Location; }[]) {

        if (functions.length > 0) {
            this.data = [new HomeItem('Found Methods:', [

                new HomeItem(functions[1].name),
                new HomeItem(functions[2].name)

            ])];
        } else {
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

    children: HomeItem[] | undefined;

    // TODO: parse location when command is executed
    command = {
        "title": "Reveal Method",
        "command": "greenIDE-home.click"
    };

    constructor(label: string, children?: HomeItem[]) {
        super(
            label,
            children === undefined ? vscode.TreeItemCollapsibleState.None :
                vscode.TreeItemCollapsibleState.Expanded);
        this.children = children;
    }

    contextValue = 'treeItem';
}