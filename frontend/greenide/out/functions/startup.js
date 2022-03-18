"use strict";
// function to parse provided csv data into seperate json files to read them later
Object.defineProperty(exports, "__esModule", { value: true });
exports.startup = void 0;
const vscode = require("vscode");
const folder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];
const fs = require('fs');
function startup() {
    // TODO: change to getrequest from backend when backend works
    // create items to parse into json
    var configItems = [];
    var locatorItems = [];
    // read provided csv
    var document = fs.readFileSync(folder + '/greenide/csv/data.csv', 'utf-8');
    document = document.split('\n');
    // get values for configItems and locatorItems
    configItems = getConfigItems(document[0]);
    locatorItems = getLocatorItems(document);
    formatInput(configItems, 'config');
    formatInput(locatorItems, 'methods');
}
exports.startup = startup;
// exctract the config items / top bar arguments from csv
function getConfigItems(document) {
    var items = [];
    // slice front and end from line
    var startIndex = document.indexOf(',');
    var lastIndex = document.indexOf('run_time(ms;<)');
    var line = document.slice(startIndex + 1, lastIndex - 2);
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
function formatInput(items, mode) {
    var objS = { system: 'kanzi' };
    var jsonS = JSON.stringify(objS, null, '\t');
    fs.writeFile(folder + '/greenide/system.json', jsonS, 'utf8', callback);
    if (mode.match('config')) {
        var objC = {
            items: []
        };
        for (let i = 0; i < items.length; i++) {
            objC.items.push(items[i]);
        }
        var jsonC = JSON.stringify(objC, null, '\t');
        fs.writeFile(folder + '/greenide/configItems.json', jsonC, 'utf8', callback);
    }
    else {
        var objM = {
            methods: []
        };
        for (let i = 0; i < items.length; i++) {
            objM.methods.push(items[i]);
        }
        var jsonM = JSON.stringify(objM, null, '\t');
        fs.writeFile(folder + '/greenide/locatorItems.json', jsonM, 'utf8', callback);
    }
}
// useless, just for reading file to work
function callback(arg0, json, arg2, callback) { }
//# sourceMappingURL=startup.js.map