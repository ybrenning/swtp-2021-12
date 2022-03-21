// function for backend communication

import * as vscode from 'vscode';
import { applyData } from './applyData';
import { getSystem } from './getSystem';
import { getFolder } from './getFolder';
import fs = require('fs');

const folder = getFolder();

// Performs analysis
export function runAnalysis(functions: {
    name: string;
    method: string;
    runtime: number[],
    energy: number[],
    kind: vscode.SymbolKind;
    containerName: string;
    location: vscode.Location;
}[]) {

    // read defined software system
    var softwareSystem = getSystem();

    // parse default and applied config to format for backend
    var jsonDefault = parseToSend(functions, 0);
    var jsonApplied = parseToSend(functions, 1);

    // get data from backend for both default and applied functions
    var responseDefault = getData(jsonDefault, softwareSystem);
    var responseApplied = getData(jsonApplied, softwareSystem);

    // apply data if backend responds correctly
    if (responseDefault !== undefined && responseApplied !== undefined) {
        applyData(functions, responseDefault, responseApplied);
    }
}

// Get data from backend via ajax post-request
function getData(json: string, softwareSystem: string) {

    // post values and save response 
    console.log(json);
    json = JSON.stringify(JSON.parse(json));

    // if json is correctly formatted ...
    if (json.length > 0) {

        // initiate post-request / create needed arguments
        var xmlRequest = require('xhr2');
        const http = new xmlRequest();
        const urlPost = 'https://swtp-2021-12-production.herokuapp.com/calculateValues/' + softwareSystem;

        // prepare post
        http.open("POST", urlPost, true);

        // set header
        http.setRequestHeader('Content-Type', 'application/json');
        http.setRequestHeader('Accept', 'application/json');

        // send data
        http.send(json);

        // listen for backend to receive data and continue
        http.onreadystatechange = () => {
            if (http.responseText.length > 0) {
                console.log(http.responseText);
                return http.responseText;
            }
        };
    }
}

// format data into new json to send to backend
function parseToSend(functions: {
    name: string;
    method: string;
    runtime: number[],
    energy: number[],
    kind: vscode.SymbolKind;
    containerName: string;
    location: vscode.Location;
}[], mode: number) {

    var configs;

    // switch case for both post datas
    // 0 - data without config applied
    // 1 - data with config applied
    switch (mode) {

        case 0:
            configs = ['root'];
            break;

        case 1:
            // read current configs
            var result = JSON.parse(fs.readFileSync(folder + '/greenide/configuration.json', 'utf8'));
            configs = [];

            // from read configs, get active config (config[0])
            if (result.config[0] === undefined) { configs = []; }
            else { configs = result.config[0].config; }
            break;
    }

    // define collection for data
    var obj = {
        functions: [] as any,
        configs: [] as any
    };

    // push both current functions and default/applied config into json
    for (let i = 0; i < configs.length; i++) { obj.configs.push(configs[i]); }
    for (let i = 0; i < functions.length; i++) { obj.functions.push(functions[i].method); }
    var json = JSON.stringify(obj, null, '\t');

    // return formatted json to send to backend
    return json;
}