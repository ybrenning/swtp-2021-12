import * as vscode from 'vscode';
import { getFolder } from './getFolder';

const folder = getFolder();
const fs = require('fs');

export async function initiate() {

    // create needed directories
    const fs = require('fs');
    fs.mkdirSync(folder + '/greenide/', { recursive: true });
    fs.mkdirSync(folder + '/greenide/csv/', { recursive: true });

    // declare software system, default for customer is kanzi, can be changed
    var objS = {
        system: '' as any
    };
    objS.system = 'kanzi';
    var jsonS = JSON.stringify(objS,null,'\t');

    fs.writeFileSync(folder + '/greenide/system.json', jsonS, 'utf8');
}

function callback(arg0: string, jsonS: string, arg2: string, callback: any) { }
