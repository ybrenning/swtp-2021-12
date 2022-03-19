// apply the data received from backend
// parse the energy and runtime data into functions and return the modified functions

import * as vscode from 'vscode';

export function applyData(functions: { 
    name: string; 
    method: string; 
    runtime: number;
    energy: number;
    kind: vscode.SymbolKind; 
    containerName: string; 
    location: vscode.Location;
}[], dataDefault: string, dataApplied: string) {

    

    return functions;
}