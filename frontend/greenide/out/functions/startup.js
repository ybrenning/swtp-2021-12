"use strict";
// function to parse provided csv data into seperate json files to read them later
Object.defineProperty(exports, "__esModule", { value: true });
exports.startup = void 0;
const getFolder_1 = require("./getFolder");
const getSystem_1 = require("./getSystem");
const folder = (0, getFolder_1.getFolder)();
const fs = require('fs');
// function checks if new csv file or any changes are applied when refreshing greenIDE
function startup() {
    var softwareSystem = (0, getSystem_1.getSystem)();
    // get functions list from backend
    var xmlRequest = require('xhr2');
    const http = new xmlRequest();
    const urlGet = 'https://swtp-2021-12-production.herokuapp.com/listOfFunctions/' + softwareSystem;
    // prepare get-request
    http.open("GET", urlGet);
    // send get-request
    http.send();
    // apply data from backend
    http.onreadystatechange = () => {
        formatInput(http.responseText, 'methods');
    };
    // read provided csv
    var result = fs.readFileSync(folder + '/greenide/csv/data.csv', 'utf-8');
    result = result.split('\n');
    // create items to parse into json
    var configItems = [];
    configItems = getConfigItems(result[0]);
    formatInput(configItems, 'config');
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
    // returns saved items for configurations
    return items;
}
// format provided data from either csv or backend
async function formatInput(items, mode) {
    // format config elements
    if (mode.match('config')) {
        var objC = {
            items: []
        };
        for (let i = 0; i < items.length; i++) {
            objC.items.push(items[i]);
        }
        // parse coonfig items into file
        var jsonC = JSON.stringify(objC, null, '\t');
        fs.writeFileSync(folder + '/greenide/configItems.json', jsonC, 'utf8');
        // else, format data from backend
    }
    else {
        var objM = {
            methods: []
        };
        // if backend sent data correctly ...
        if (items.length > 0) {
            // format received items
            items = JSON.parse(items);
            for (let i = 0; i < items.length; i++) {
                objM.methods.push(items[i] + '()');
            }
            // parse items / functions into file
            var jsonM = JSON.stringify(objM, null, '\t');
            fs.writeFileSync(folder + '/greenide/locatorItems.json', jsonM, 'utf8');
        }
    }
}
//# sourceMappingURL=startup.js.map