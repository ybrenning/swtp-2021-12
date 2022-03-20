// function for backend communication

import * as vscode from 'vscode';
import axios, { AxiosResponse } from 'axios';
import { applyData } from './applyData';
import { getSystem } from './getSystem';

const folder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];
const fs = require('fs');

// Performs analysis
// Procedure order:
//  1. retreive funtions, (done)
//  2. provide methods to backend,
//  3. retreive analysis from backend,
//  4. display results(Webview and syntax highlighting)
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
    //var softwareSystem = JSON.parse(fs.readFileSync(folder + '/greenide/system.json', 'utf8'));
    //console.log(softwareSystem);

    var softwareSystem = getSystem();

    // TEST suite
    console.log('SWS IN RUNANA');
    console.log(softwareSystem);

    var functionsNEW: { 
        name: string; 
        method: string; 
        runtime: number[],
        energy: number[],
        kind: vscode.SymbolKind;
        containerName: string;
        location: vscode.Location;
    }[] = [];

    var jsonDefault = parseToSend(functions,0);
    var jsonApplied = parseToSend(functions,1);

    var responseDefault = getData(jsonDefault,softwareSystem);
    var responseApplied = getData(jsonApplied,softwareSystem);

    // check if backend reacted
    console.log(responseDefault);
    console.log(responseApplied);

    if (responseDefault !== undefined && responseApplied !== undefined) {
        applyData(functions,responseDefault,responseApplied);
    } else {
        // TEST suite, apply hardcode
        responseDefault = JSON.parse(fs.readFileSync('/Users/ferris/PECK/SWP/swtp-2021-12/frontend/greenide/src/configurations/respDefault.json', 'utf8'));
        responseApplied = JSON.parse(fs.readFileSync('/Users/ferris/PECK/SWP/swtp-2021-12/frontend/greenide/src/configurations/respApplied.json', 'utf8'));
        
        //var functionsNEW = applyData(functions,responseDefault,responseApplied);
        applyData(functions,responseDefault,responseApplied);
    }
}

function getData(json: string, softwareSystem: string) {

    // post values and save response 
    json = JSON.stringify(JSON.parse(json));

    if (json.length > 0) {

        // TEST suite
        console.log('TEST SENDING');
        console.log(json);

        var xmlRequest = require('xhr2');
        const http = new xmlRequest();
        const urlPost='https://swtp-2021-12-production.herokuapp.com/calculateValues/' + softwareSystem;

        http.open("POST", urlPost, true);
        http.setRequestHeader('Content-Type','application/json');
        http.setRequestHeader('Accept','application/json');
        http.send(json);
        http.onreadystatechange = () => {
            if (http.responseText.length > 0) {
                console.log(http.responseText);
                return http.responseText;
            }
        };
    }
}

function parseToSend(functions: { 
    name: string; 
    method: string; 
    runtime: number[],
    energy: number[],
    kind: vscode.SymbolKind; 
    containerName: string; 
    location: vscode.Location;
}[], mode: number){

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
            if (result.config[0] === undefined) { config = []; } 
            else { config = result.config[0].config; }
            break;
    }

    // define collection for data
    var obj = {
        functions: [] as any,
        config: [] as any
    };

    for (let i = 0; i < config.length; i++) { obj.config.push(config[i]); }
    for (let i = 0; i < functions.length; i++) { obj.functions.push(functions[i].method); }
    var json = JSON.stringify(obj,null,'\t');

    return json;
}

// For file reading, not purpose though
function callback(arg0: string, json: any, arg2: string, callback: any) { }