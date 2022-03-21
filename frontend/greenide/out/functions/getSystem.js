"use strict";
// helping function to provide wanted software system
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystem = void 0;
const getFolder_1 = require("./getFolder");
const fs = require("fs");
const folder = (0, getFolder_1.getFolder)();
function getSystem() {
    // read softwareSystem from json, change json file to change software system
    var softwareSystem = JSON.parse(fs.readFileSync(folder + '/greenide/system.json', 'utf8'));
    // return as export to get in any file
    return softwareSystem.system;
}
exports.getSystem = getSystem;
//# sourceMappingURL=getSystem.js.map