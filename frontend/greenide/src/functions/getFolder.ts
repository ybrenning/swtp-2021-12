import * as vscode from 'vscode';

export function getFolder() {

    const folder = vscode.workspace.workspaceFolders!.map(folder => folder.uri.path)[0];

    console.log(folder);

    return folder;
}