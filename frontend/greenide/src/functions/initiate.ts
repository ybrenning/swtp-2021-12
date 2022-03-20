import * as vscode from 'vscode';

const folder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];
const fs = require('fs');

export function initiate() {

    // create needed directories
    const fs = require('fs');
    fs.mkdirSync(folder + '/greenide/', { recursive: true });
    fs.mkdirSync(folder + '/greenide/csv/', { recursive: true });
    // declare software system, default for customer is kanzi, can be changed
    var objS = {
        system: '' as any
    };
    objS.system = 'kanzi';
    var jsonS = JSON.stringify(objS,null,'\t');
    fs.writeFile(folder + '/greenide/system.json', jsonS, 'utf8', callback);
}

export function getSystem() {

    var softwareSystem = JSON.parse(fs.readFileSync(folder + '/greenide/system.json', 'utf8'));
    softwareSystem = softwareSystem.system;
    return softwareSystem;
}

function callback(arg0: string, jsonS: string, arg2: string, callback: any) { }
