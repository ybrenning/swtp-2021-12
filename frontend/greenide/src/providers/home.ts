// provider for first tab in side panel, home
// start/reload greenIDE, see found methods, get data, activate syntax highlighting

import * as vscode from 'vscode';

export interface Signature {
    name: string;
}

export class HomeProvider implements vscode.TreeDataProvider<Signature> {
    
    onDidChangeTreeData?: vscode.Event<void | Signature | null | undefined> | undefined;
    
    getTreeItem(element: Signature): vscode.TreeItem | Thenable<vscode.TreeItem> {
        
        throw new Error('Method not implemented.');
    }
    
    getChildren(element?: Signature): vscode.ProviderResult<Signature[]> {
        
        throw new Error('Method not implemented.');
    }

    
}