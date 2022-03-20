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

    // TEST suite, apply hardcode
    responseDefault = JSON.parse(fs.readFileSync('/Users/ferris/PECK/SWP/swtp-2021-12/frontend/greenide/src/configurations/respDefault.json', 'utf8'));
    responseApplied = JSON.parse(fs.readFileSync('/Users/ferris/PECK/SWP/swtp-2021-12/frontend/greenide/src/configurations/respApplied.json', 'utf8'));

    // TEST suite
    console.log('DATA DEFAULT');
    console.log(responseDefault);
    console.log('DATA APPLIED');
    console.log(responseApplied);
    
    var functionsNEW = applyData(functions,responseDefault,responseApplied);

    //return functionsNEW;
}

function getData(json: string, softwareSystem: string) {

    // post values and save response 
    /*var response1Raw;
    const urlPost='https://swtp-2021-12-production.herokuapp.com/calculateValues/' + softwareSystem;

    // TEST suite
    console.log('URL ADDRESS');
    console.log(urlPost);

    axios({
        method: 'post',
        url: urlPost,
        data: json
    })
    .then(data=>(response1Raw=data))
    .catch(err=>console.log(err));*/

    json = JSON.stringify(json);

    // TEST suite
    console.log('TEST SENDING');
    console.log(JSON.parse(json));

    var xmlRequest = require('xhr2');
    const http = new xmlRequest();
    const urlPost='https://swtp-2021-12-production.herokuapp.com/calculateValues/' + softwareSystem;

    http.open("POST", urlPost);
    http.send(json);
    http.onreadystatechange = () => {
        console.log(http.responseText);
    };

    var response1Raw = '';

    return JSON.stringify(response1Raw);
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