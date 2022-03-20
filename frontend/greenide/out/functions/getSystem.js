"use strict";
// helping function to provide current software system
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystem = void 0;
const getFolder_1 = require("./getFolder");
const folder = (0, getFolder_1.getFolder)();
const fs = require('fs');
function getSystem() {
    var softwareSystem = JSON.parse(fs.readFileSync(folder + '/greenide/system.json', 'utf8'));
    return softwareSystem.system;
}
exports.getSystem = getSystem;
//# sourceMappingURL=getSystem.js.map