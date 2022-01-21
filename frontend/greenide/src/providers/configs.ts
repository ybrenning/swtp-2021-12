// provider for second tab in side panel, configs
// drop down / tree view for all methods to apply, save methods in favorites

import * as vscode from 'vscode';

export interface Signature {
    name: string;
}

export class ConfigsProvider implements vscode.TreeDataProvider<Signature> {
    
    onDidChangeTreeData?: vscode.Event<void | Signature | null | undefined> | undefined;
    
    getTreeItem(element: Signature): vscode.TreeItem | Thenable<vscode.TreeItem> {
        
        throw new Error('Method not implemented.');
    }
    
    getChildren(element?: Signature): vscode.ProviderResult<Signature[]> {
        
        throw new Error('Method not implemented.');
    }

    
}