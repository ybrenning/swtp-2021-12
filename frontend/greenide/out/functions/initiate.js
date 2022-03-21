"use strict";
// initialization of needed directories when first starting greenIDE
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiate = void 0;
const getFolder_1 = require("./getFolder");
const fs = require("fs");
const folder = (0, getFolder_1.getFolder)();
async function initiate() {
    // create needed directories
    fs.mkdirSync(folder + '/greenide/', { recursive: true });
    fs.mkdirSync(folder + '/greenide/csv/', { recursive: true });
    // declare software system, default for customer is kanzi, can be changed
    var objS = {
        system: ''
    };
    objS.system = 'kanzi';
    var jsonS = JSON.stringify(objS, null, '\t');
    // create system.json
    fs.writeFileSync(folder + '/greenide/system.json', jsonS, 'utf8');
}
exports.initiate = initiate;
//# sourceMappingURL=initiate.js.map