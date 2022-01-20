// provider for first tab in side panel, home

import * as vscode from 'vscode';

export interface Signature {
    name: string;
}

export class HomeProvider implements vscode.TreeDataProvider<Signature> {
    
    onDidChangeTreeData?: vscode.Event<void | Signature | null | undefined> | undefined;
    
    getTreeItem(element: Signature): vscode.TreeItem | Thenable<vscode.TreeItem> {

        // change that favorable message is thrown
        throw new Error('Method not implemented.');
    }
    
    getChildren(element?: Signature): vscode.ProviderResult<Signature[]> {
        
        // change that favorable message is thrown
        throw new Error('Method not implemented.');
    }

    
}