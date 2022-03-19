"use strict";
// function for backend communication
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAnalysis = void 0;
const vscode = require("vscode");
const axios_1 = require("axios");
const applyData_1 = require("./applyData");
const folder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];
const fs = require('fs');
// Performs analysis
// Procedure order:
//  1. retreive funtions, (done)
//  2. provide methods to backend,
//  3. retreive analysis from backend,
//  4. display results(Webview and syntax highlighting)
function runAnalysis(functions) {
    var functionsNEW = [];
    // read defined software system
    var softwareSystem = fs.readFileSync(folder + '/greenide/system.json', 'utf8');
    var jsonDefault = parseToSend(functions, 0);
    var jsonApplied = parseToSend(functions, 1);
    var responseDefault = getData(jsonDefault, softwareSystem);
    var responseApplied = getData(jsonApplied, softwareSystem);
    // TEST suite, apply hardcode
    responseDefault = JSON.parse(fs.readFileSync('/Users/ferris/PECK/SWP/swtp-2021-12/frontend/greenide/src/configurations/respDefault.json', 'utf8'));
    responseApplied = JSON.parse(fs.readFileSync('/Users/ferris/PECK/SWP/swtp-2021-12/frontend/greenide/src/configurations/respApplied.json', 'utf8'));
    // TEST suite
    console.log('DATA DEFAULT');
    console.log(responseDefault);
    console.log('DATA APPLIED');
    console.log(responseApplied);
    var functionsNEW = (0, applyData_1.applyData)(functions, responseDefault, responseApplied);
    // TEST suite
    console.log('APPLIED DATA');
    console.log(functionsNEW);
    //return functionsNEW;
}
exports.runAnalysis = runAnalysis;
function getData(json, softwareSystem) {
    // post values and save response 
    var response1Raw;
    const urlPost = 'https://swtp-2021-12-production.herokuapp.com/calculateValues/' + softwareSystem + '/';
    (0, axios_1.default)({
        method: 'post',
        url: urlPost,
        data: json
    })
        .then(data => (response1Raw = data))
        .catch(err => console.log(err));
    return JSON.stringify(response1Raw);
}
function parseToSend(functions, mode) {
    // switch case for both post datas
    // 0 - data without config applied
    // 1 - data with config applied
    switch (mode) {
        case 0:
            var config = [];
            break;
        case 1:
            // read current config
            var result = JSON.parse(fs.readFileSync(folder + '/greenide/configuration.json', 'utf8'));
            var config = [];
            // get active config
            if (result.config[0] === undefined) {
                config = [];
            }
            else {
                config = result.config[0].config;
            }
            break;
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
    return json;
}
//# sourceMappingURL=runAnalysis.js.map