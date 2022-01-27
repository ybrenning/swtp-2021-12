// provider for first tab in side panel, home
// start/reload greenIDE, see found methods, get data, activate syntax highlighting

import * as vscode from 'vscode';
import { Hover, HoverProvider, ProviderResult } from 'vscode';
import { MessagePort, TransferListItem } from 'worker_threads';



export class HomeProvider implements vscode.TreeDataProvider<TreeItem> {
    
    onDidChangeTreeData?: vscode.Event<TreeItem|null|undefined>|undefined;
  
    data: TreeItem[];

    constructor(functions: { name: string; kind: vscode.SymbolKind; containerName: string; location: vscode.Location; }[]) {

        if (functions.length > 0) {
            this.data = [new TreeItem('Found Methods:', [
            
                new TreeItem(functions[1].name),
                new TreeItem(functions[2].name)

            ])];
        } else {
            this.data = [new TreeItem('No Methods found')];
        }
    }
    
    getTreeItem(element: TreeItem): vscode.TreeItem|Thenable<vscode.TreeItem> {
        
        return element;
    }
    
    getChildren(element?: TreeItem|undefined): vscode.ProviderResult<TreeItem[]> {
        
        if (element === undefined) {
          return this.data;
        }
        return element.children;
      }
}

  
class TreeItem extends vscode.TreeItem {
    
    children: TreeItem[]|undefined;
  
    constructor(label: string, children?: TreeItem[]) {
      super(
          label,
          children === undefined ? vscode.TreeItemCollapsibleState.None :
                                   vscode.TreeItemCollapsibleState.Expanded);
      this.children = children;
    }
}