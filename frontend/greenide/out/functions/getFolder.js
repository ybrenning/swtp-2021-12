"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFolder = void 0;
const vscode = require("vscode");
function getFolder() {
    const folder = vscode.workspace.workspaceFolders.map(folder => folder.uri.path)[0];
    console.log(folder);
    return folder;
}
exports.getFolder = getFolder;
//# sourceMappingURL=getFolder.js.map