"use strict";
// provides the workspace folder
// a small if-statement to fix windows path conversion
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFolder = void 0;
const vscode = require("vscode");
// import os-features
const os = require("os");
function getFolder() {
    // get folder from open workspace
    var folder = vscode.workspace.workspaceFolders.map(folder => folder.uri.path)[0];
    // if system is windows ...
    if ((os.platform().match('win32'))) {
        // cut first '\' from string
        folder = folder.substring(1);
    }
    // return string to implement folder-path in any file
    return folder;
}
exports.getFolder = getFolder;
//# sourceMappingURL=getFolder.js.map