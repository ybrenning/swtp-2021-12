import * as vscode from 'vscode';

export function getFolder() {

    var folder = vscode.workspace.workspaceFolders!.map(folder => folder.uri.path)[0];

    const os = require('os');
    if (!(os.platform().match('darwin'))) {
        folder = folder.substring(1);
    }

    console.log(folder);

    return folder;
}