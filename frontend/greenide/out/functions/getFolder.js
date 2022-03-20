"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFolder = void 0;
const vscode = require("vscode");
function getFolder() {
    var folder = vscode.workspace.workspaceFolders.map(folder => folder.uri.path)[0];
    const os = require('os');
    if (!(os.platform().match('darwin'))) {
        folder = folder.substring(1);
    }
    return folder;
}
exports.getFolder = getFolder;
//# sourceMappingURL=getFolder.js.map