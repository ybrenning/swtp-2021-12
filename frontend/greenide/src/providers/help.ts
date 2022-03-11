// provider for third tab in side panel, help
// istructions on how to use greenIDE, commands, links etc.

import * as vscode from 'vscode';

export interface Signature {
    name: string;
}

export class HelpProvider implements vscode.TreeDataProvider<Signature> {
    
    onDidChangeTreeData?: vscode.Event<void | Signature | null | undefined> | undefined;
    
    getTreeItem(element: Signature): vscode.TreeItem | Thenable<vscode.TreeItem> {
        
        throw new Error('Method not implemented.');
    }
    
    getChildren(element?: Signature): vscode.ProviderResult<Signature[]> {
        
        throw new Error('Method not implemented.');
    }

    
}