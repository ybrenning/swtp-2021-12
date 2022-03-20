"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystem = exports.initiate = void 0;
const vscode = require("vscode");
const folder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];
const fs = require('fs');
function initiate() {
    // create needed directories
    const fs = require('fs');
    fs.mkdirSync(folder + '/greenide/', { recursive: true });
    fs.mkdirSync(folder + '/greenide/csv/', { recursive: true });
    // declare software system, default for customer is kanzi, can be changed
    var objS = {
        system: ''
    };
    objS.system = 'kanzi';
    var jsonS = JSON.stringify(objS, null, '\t');
    fs.writeFile(folder + '/greenide/system.json', jsonS, 'utf8', callback);
}
exports.initiate = initiate;
function getSystem() {
    var softwareSystem = JSON.parse(fs.readFileSync(folder + '/greenide/system.json', 'utf8'));
    softwareSystem = softwareSystem.system;
    return softwareSystem;
}
exports.getSystem = getSystem;
function callback(arg0, jsonS, arg2, callback) { }
//# sourceMappingURL=initiate.js.map