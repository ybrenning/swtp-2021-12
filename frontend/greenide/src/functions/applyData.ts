// apply the data received from backend
// parse the energy and runtime data into functions and return the modified functions

import * as vscode from 'vscode';

export function applyData(functions: {
    name: string;
    method: string;
    runtime: number[],
    energy: number[],
    kind: vscode.SymbolKind;
    containerName: string;
    location: vscode.Location;
}[], dataDefault: any, dataApplied: any) {

    // apply default data from backend
    for (let i = 0; i < dataDefault.results.length; i++) {
        functions[i].runtime[0] = dataDefault.results[i].time;
        functions[i].energy[0] = dataDefault.results[i].energy;
    }

    // apply from config applied data from backend
    for (let i = 0; i < dataApplied.results.length; i++) {
        functions[i].runtime[1] = dataDefault.results[i].time + dataApplied.results[i].time;
        functions[i].energy[1] = dataDefault.results[i].energy + dataApplied.results[i].energy;
    }
}