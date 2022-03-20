// helping function to provide current software system

import * as vscode from 'vscode';
import { getFolder } from './getFolder';

const folder = getFolder();
const fs = require('fs');

export function getSystem() {

    var softwareSystem = JSON.parse(fs.readFileSync(folder + '/greenide/system.json', 'utf8'));

    return softwareSystem.system;
}