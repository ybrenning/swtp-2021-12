"use strict";
// creates system.json to provide the name of used system (e.g. kanzi)
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiateSystem = void 0;
const vscode = require("vscode");
const folder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];
const fs = require('fs');
async function initiateSystem() {
    // declare software system, default for customer is kanzi, can be changed
    var objS = {
        system: ''
    };
    objS.system = 'kanzi';
    var jsonS = JSON.stringify(objS, null, '\t');
    const writer = fs.writeFile(folder + '/greenide/system.json', jsonS, 'utf8', callback);
    await writer;
}
exports.initiateSystem = initiateSystem;
function callback(arg0, jsonS, arg2, callback) { }
//# sourceMappingURL=initiateSystem.js.map