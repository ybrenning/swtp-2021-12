import * as vscode from 'vscode';
const folder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];

// Performs analysis
// Procedure order:
//  1. retreive funtions, (done)
//  2. provide methods to backend,
//  3. retreive analysis from backend,
//  4. display results(Webview and syntax highlighting)
export function runAnalysis(functions: { 
    name: string; 
    method: string; 
    kind: vscode.SymbolKind; 
    containerName: string; 
    location: vscode.Location;
}[]) {

    // read current config
    const fs = require('fs');
    var result = JSON.parse(fs.readFileSync(folder + '/configurations/configuration.json', 'utf8'));
    var config = [];

    if (result.config[0] === undefined) {
        config = [];
    } else {
        config = result.config[0].config;
    }
    
    // TESt suite
    console.log('TEST CONFIG EMPFANG');
    console.log(config);

    // define collection for data
    var obj = {
        functions: [] as any,
        config: [] as any
    };

    console.log('START READER');

    for (let i = 0; i < config.length; i++) {
        obj.config.push(config[i]);
    }

    for (let i = 0; i < functions.length; i++) {
        obj.functions.push(functions[i].name);
    }

    // TEST suite
    console.log('TEST OBJ');
    console.log(obj);

    // TEST suite
    console.log('METHODS:');
    for (let i = 0; i < functions.length; i++) {
        console.log(functions[i].method);
    }
    
    // TODO: continue with parsing for backend, write file etc.
}
