// initialization of needed directories when first starting greenIDE

import { getFolder } from './getFolder';
import fs = require('fs');

const folder = getFolder();

export async function initiate() {

    // create needed directories
    fs.mkdirSync(folder + '/greenide/', { recursive: true });
    fs.mkdirSync(folder + '/greenide/csv/', { recursive: true });

    // declare software system, default for customer is kanzi, can be changed
    var objS = {
        system: '' as any
    };
    objS.system = 'kanzi';
    var jsonS = JSON.stringify(objS, null, '\t');

    // create system.json
    fs.writeFileSync(folder + '/greenide/system.json', jsonS, 'utf8');
}