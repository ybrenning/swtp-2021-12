// helping function to provide current software system

import * as vscode from 'vscode';

const folder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];
const fs = require('fs');

export function getSystem() {

    var softwareSystem = JSON.parse(fs.readFileSync(folder + '/greenide/system.json', 'utf8'));

    return softwareSystem.system;
}