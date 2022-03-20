// function to parse provided csv data into seperate json files to read them later

import { getFolder } from './getFolder';
import { getSystem } from './getSystem';

const folder = getFolder();
const fs = require('fs');

export function startup() {

    var softwareSystem = getSystem();

    var xmlRequest = require('xhr2');
    const http = new xmlRequest();
    const urlGet = 'https://swtp-2021-12-production.herokuapp.com/listOfFunctions/' + softwareSystem;

    http.open("GET", urlGet);
    http.send();
    http.onreadystatechange = () => {
        formatInput(http.responseText,'methods');
    };

    // read provided csv
    var result = fs.readFileSync(folder + '/greenide/csv/data.csv', 'utf-8');
    result = result.split('\n');

    /*// create items to parse into json
    var locatorItems: string[] = [];
    locatorItems = getLocatorItems(result);
    formatInput(locatorItems,'methods');*/

    // create items to parse into json
    var configItems: string[] = [];
    configItems = getConfigItems(result[0]);
    formatInput(configItems,'config');
}

// exctract the config items / top bar arguments from csv
function getConfigItems(result: string) {

    var items: string[] = [];

    // slice front and end from line
    var startIndex = result.indexOf(',');
    var lastIndex = result.indexOf('run_time(ms;<)');
    var line = result.slice(startIndex+1,lastIndex-2);

    // seperate each item from its comma, like real csv's
    items = line.split(',');
    for (let i = 0; i < items.length; i++) {
        items[i] = items[i].slice(1,items[i].length-1);
    }

    return items;
}

function getLocatorItems(document: string[]) {

    var items: string[] = [];

    // cut the first element, the function, from every line
    for (let i = 1; i < document.length; i++) {
        if (document[i].length !== 0) {
            var index = document[i].indexOf(',');
            var line = (document[i].slice(1,index-1)) + '()';
            items.push(line);
        }
    }

    return items.filter((item,index) => items.indexOf(item) === index);
}

async function formatInput(items: any, mode: string) {

    if (mode.match('config')) {

        var objC = {
            items: [] as any
        };
        for (let i = 0; i < items.length; i++) {
            objC.items.push(items[i]);
        }

        var jsonC = JSON.stringify(objC,null,'\t');
        fs.writeFileSync(folder + '/greenide/configItems.json', jsonC, 'utf8');
    } else {

        // without backend
        /*var objM = {
            methods: [] as any
        };
        for (let i = 0; i < items.length; i++) {
            objM.methods.push(items[i]);
        }

        var jsonM = JSON.stringify(objM,null,'\t');
        fs.writeFileSync(folder + '/greenide/locatorItems.json', jsonM, 'utf8');*/

        // with backend
        var objM = {
            methods: [] as any
        };

        if (items.length > 0) {

            items = JSON.parse(items);

            for (let i = 0; i < items.length; i++) {
                objM.methods.push(items[i] + '()');
            }

            var jsonM = JSON.stringify(objM,null,'\t');
            fs.writeFileSync(folder + '/greenide/locatorItems.json', jsonM, 'utf8');
        }
    }
}

// useless, just for reading file to work
function callback(arg0: string, json: any, arg2: string, callback: any) { }