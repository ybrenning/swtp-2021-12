"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiate = void 0;
const getFolder_1 = require("./getFolder");
const folder = (0, getFolder_1.getFolder)();
const fs = require('fs');
async function initiate() {
    // create needed directories
    const fs = require('fs');
    fs.mkdirSync(folder + '/greenide/', { recursive: true });
    fs.mkdirSync(folder + '/greenide/csv/', { recursive: true });
    // declare software system, default for customer is kanzi, can be changed
    var objS = {
        system: ''
    };
    objS.system = 'kanzi';
    var jsonS = JSON.stringify(objS, null, '\t');
    fs.writeFileSync(folder + '/greenide/system.json', jsonS, 'utf8');
}
exports.initiate = initiate;
function callback(arg0, jsonS, arg2, callback) { }
//# sourceMappingURL=initiate.js.map