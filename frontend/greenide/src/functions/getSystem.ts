// helping function to provide wanted software system

import { getFolder } from './getFolder';
import fs = require('fs');

const folder = getFolder();

export function getSystem() {

    // read softwareSystem from json, change json file to change software system
    var softwareSystem = JSON.parse(fs.readFileSync(folder + '/greenide/system.json', 'utf8'));

    // return as export to get in any file
    return softwareSystem.system;
}