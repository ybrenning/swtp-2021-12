"use strict";
// function for backend communication
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAnalysis = void 0;
const applyData_1 = require("./applyData");
const getSystem_1 = require("./getSystem");
const getFolder_1 = require("./getFolder");
const folder = (0, getFolder_1.getFolder)();
const fs = require('fs');
// Performs analysis
// Procedure order:
//  1. retreive funtions, (done)
//  2. provide methods to backend,
//  3. retreive analysis from backend,
//  4. display results(Webview and syntax highlighting)
function runAnalysis(functions) {
    // read defined software system
    //var softwareSystem = JSON.parse(fs.readFileSync(folder + '/greenide/system.json', 'utf8'));
    //console.log(softwareSystem);
    var softwareSystem = (0, getSystem_1.getSystem)();
    // TEST suite
    console.log('SWS IN RUNANA');
    console.log(softwareSystem);
    var functionsNEW = [];
    var jsonDefault = parseToSend(functions, 0);
    var jsonApplied = parseToSend(functions, 1);
    // TODO: Apply Response Data, remove hardcode
    var responseDefault = getData(jsonDefault, softwareSystem);
    var responseApplied = getData(jsonApplied, softwareSystem);
    // check if backend reacted
    console.log(responseDefault);
    console.log(responseApplied);
    if (responseDefault !== undefined && responseApplied !== undefined) {
        (0, applyData_1.applyData)(functions, responseDefault, responseApplied);
    }
}
exports.runAnalysis = runAnalysis;
function getData(json, softwareSystem) {
    // post values and save response 
    console.log(json);
    json = JSON.stringify(JSON.parse(json));
    if (json.length > 0) {
        // TEST suite
        console.log('TEST SENDING');
        console.log(json);
        var xmlRequest = require('xhr2');
        const http = new xmlRequest();
        const urlPost = 'https://swtp-2021-12-production.herokuapp.com/calculateValues/' + softwareSystem;
        http.open("POST", urlPost, true);
        http.setRequestHeader('Content-Type', 'application/json');
        http.setRequestHeader('Accept', 'application/json');
        http.send(json);
        http.onreadystatechange = () => {
            if (http.responseText.length > 0) {
                console.log(http.responseText);
                return http.responseText;
            }
        };
    }
}
function parseToSend(functions, mode) {
    var configs;
    // switch case for both post datas
    // 0 - data without config applied
    // 1 - data with config applied
    switch (mode) {
        case 0:
            configs = ['root'];
            break;
        case 1:
            // read current config
            var result = JSON.parse(fs.readFileSync(folder + '/greenide/configuration.json', 'utf8'));
            configs = [];
            // get active config
            if (result.config[0] === undefined) {
                configs = [];
            }
            else {
                configs = result.config[0].config;
            }
            break;
    }
    // define collection for data
    var obj = {
        functions: [],
        configs: []
    };
    for (let i = 0; i < configs.length; i++) {
        obj.configs.push(configs[i]);
    }
    for (let i = 0; i < functions.length; i++) {
        obj.functions.push(functions[i].method);
    }
    var json = JSON.stringify(obj, null, '\t');
    return json;
}
// For file reading, not purpose though
function callback(arg0, json, arg2, callback) { }
//# sourceMappingURL=runAnalysis.js.map