import * as vscode from 'vscode';

export class HomeProvider implements vscode.TreeDataProvider<Home> {
    constructor() {}

    onDidChangeTreeData?: vscode.Event<any> | undefined;

    getChildren(element?: any): vscode.ProviderResult<Home[]> {
        throw new Error('Method not implemented.');
    }
  
    getTreeItem(element: Home): vscode.TreeItem {
      return element;
    }
}

class Home {

}