// provides the workspace folder
// a small if-statement to fix windows path conversion

import * as vscode from 'vscode';
// import os-features
import os = require('os');

export function getFolder() {

    // get folder from open workspace
    var folder = vscode.workspace.workspaceFolders!.map(folder => folder.uri.path)[0];

    // if system is windows ...
    if ((os.platform().match('win32'))) {
        // cut first '\' from string
        folder = folder.substring(1);
    }

    // return string to implement folder-path in any file
    return folder;
}