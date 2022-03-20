"use strict";
// function to parse provided csv data into seperate json files to read them later
Object.defineProperty(exports, "__esModule", { value: true });
exports.startup = void 0;
const vscode = require("vscode");
const getSystem_1 = require("./getSystem");
const folder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];
const fs = require('fs');
function startup() {
    // read defined software system
    //var softwareSystem = JSON.parse(fs.readFileSync(folder + '/greenide/system.json', 'utf8'));
    //console.log(softwareSystem);
    var softwareSystem = (0, getSystem_1.getSystem)();
    // TEST suite
    console.log('SWS IN STARTUP');
    console.log(softwareSystem);
    // TODO: change to getrequest from backend when backend works
    // create items to parse into json
    var configItems = [];
    var locatorItems = [];
    // read provided csv
    var result = fs.readFileSync(folder + '/greenide/csv/data.csv', 'utf-8');
    result = result.split('\n');
    // get values for configItems and locatorItems
    configItems = getConfigItems(result[0]);
    locatorItems = getLocatorItems(result);
    formatInput(configItems, 'config');
    formatInput(locatorItems, 'methods');
}
exports.startup = startup;
// exctract the config items / top bar arguments from csv
function getConfigItems(result) {
    var items = [];
    // slice front and end from line
    var startIndex = result.indexOf(',');
    var lastIndex = result.indexOf('run_time(ms;<)');
    var line = result.slice(startIndex + 1, lastIndex - 2);
    // seperate each item from its comma, like real csv's
    items = line.split(',');
    for (let i = 0; i < items.length; i++) {
        items[i] = items[i].slice(1, items[i].length - 1);
    }
    return items;
}
function getLocatorItems(document) {
    var items = [];
    // cut the first element, the function, from every line
    for (let i = 1; i < document.length; i++) {
        if (document[i].length !== 0) {
            var index = document[i].indexOf(',');
            var line = (document[i].slice(1, index - 1)) + '()';
            items.push(line);
        }
    }
    return items.filter((item, index) => items.indexOf(item) === index);
}
async function formatInput(items, mode) {
    if (mode.match('config')) {
        var objC = {
            items: []
        };
        for (let i = 0; i < items.length; i++) {
            objC.items.push(items[i]);
        }
        var jsonC = JSON.stringify(objC, null, '\t');
        fs.writeFileSync(folder + '/greenide/configItems.json', jsonC, 'utf8');
    }
    else {
        var objM = {
            methods: []
        };
        for (let i = 0; i < items.length; i++) {
            objM.methods.push(items[i]);
        }
        var jsonM = JSON.stringify(objM, null, '\t');
        fs.writeFileSync(folder + '/greenide/locatorItems.json', jsonM, 'utf8');
    }
}
// useless, just for reading file to work
function callback(arg0, json, arg2, callback) { }
// TODO: implementation when backend works, save response
// function to parse provided csv data into seperate json files to read them later
/*
import axios from 'axios';
import * as vscode from 'vscode';

const folder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];
const fs = require('fs');
const softwareSystem = 'kanzi';

export function startup() {

    // create items to parse into json
    var configItems: string[] = [];
    var document;

    // get data from backend
    const urlGet='https://swtp-2021-12-production.herokuapp.com/listOfFunctions/' + softwareSystem + '/';
    axios.get(urlGet)
    .then(data=>(document=data))
    .catch(err=>console.log(err));

    // read provided csv
    var result = fs.readFileSync(folder + '/greenide/csv/data.csv', 'utf-8');
    result = result.split('\n');

    // get values for configItems
    configItems = getConfigItems(result[0]);

    // format configItems
    formatInput(configItems,'config');
    formatInput(document,'methods');
}

// exctract the config items / top bar arguments from csv
function getConfigItems(document: string) {

    var items: string[] = [];

    // slice front and end from line
    var startIndex = document.indexOf(',');
    var lastIndex = document.indexOf('run_time(ms;<)');
    var line = document.slice(startIndex+1,lastIndex-2);

    // seperate each item from its comma, like real csv's
    items = line.split(',');
    for (let i = 0; i < items.length; i++) {
        items[i] = items[i].slice(1,items[i].length-1);
    }

    return items;
}

async function formatInput(items: any, mode: string) {

    // declare software system, default for customer is kanzi, can be changed
    var objS = {
        system: '' as any
    };
    objS.system = 'kanzi';
    var jsonS = JSON.stringify(objS,null,'\t');
    const writer = fs.writeFile(folder + '/greenide/system.json', jsonS, 'utf8', callback);
    await writer;

    if (mode.match('config')) {

        var objC = {
            items: [] as any
        };
        for (let i = 0; i < items.length; i++) {
            objC.items.push(items[i]);
        }

        var jsonC = JSON.stringify(objC,null,'\t');
        fs.writeFile(folder + '/greenide/configItems.json', jsonC, 'utf8', callback);
    } else {

        // parse response from server into locatorItems.json
        var jsonM = JSON.stringify(document,null,'\t');
        fs.writeFile(folder + '/greenide/locatorItems.json', jsonM, 'utf8', callback);
    }
}

function callback(arg0: string, json: string, arg2: string, callback: any) { }
*/ 
//# sourceMappingURL=startup.js.map