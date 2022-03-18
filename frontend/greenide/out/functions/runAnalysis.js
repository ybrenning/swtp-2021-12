"use strict";
// function for backend communication
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAnalysis = void 0;
const vscode = require("vscode");
const axios_1 = require("axios");
const folder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];
// Performs analysis
// Procedure order:
//  1. retreive funtions, (done)
//  2. provide methods to backend,
//  3. retreive analysis from backend,
//  4. display results(Webview and syntax highlighting)
function runAnalysis(functions) {
    var softwareSystem = 'kanzi';
    // read current config
    const fs = require('fs');
    var result = JSON.parse(fs.readFileSync(folder + '/greenide/configuration.json', 'utf8'));
    var config = [];
    if (result.config[0] === undefined) {
        config = [];
    }
    else {
        config = result.config[0].config;
    }
    // define collection for data
    var obj = {
        functions: [],
        config: []
    };
    for (let i = 0; i < config.length; i++) {
        obj.config.push(config[i]);
    }
    for (let i = 0; i < functions.length; i++) {
        obj.functions.push(functions[i].method);
    }
    var json = JSON.stringify(obj, null, '\t');
    // for message
    // http postrequest for data, getrequest for functions
    // post 
    const urlPost = 'https://swtp-2021-12-production.herokuapp.com/calculateValues/' + softwareSystem + '/';
    (0, axios_1.default)({
        method: 'post',
        url: urlPost,
        data: json
    })
        .then(data => console.log(data))
        .catch(err => console.log(err));
}
exports.runAnalysis = runAnalysis;
//# sourceMappingURL=runAnalysis.js.map