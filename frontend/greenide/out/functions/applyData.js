"use strict";
// apply the data received from backend
// parse the energy and runtime data into functions and return the modified functions
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyData = void 0;
function applyData(functions, dataDefault, dataApplied) {
    // TEST suite
    console.log('TEST PROVIDING DATA');
    // apply default data from backend
    for (let i = 0; i < dataDefault.results.length; i++) {
        functions[i].runtime[0] = dataDefault.results[i].time;
        functions[i].energy[0] = dataDefault.results[i].energy;
    }
    // apply from config applied data from backend
    for (let i = 0; i < dataApplied.results.length; i++) {
        functions[i].runtime[1] = dataDefault.results[i].time + dataApplied.results[i].time;
        functions[i].energy[1] = dataDefault.results[i].energy + dataApplied.results[i].energy;
    }
}
exports.applyData = applyData;
//# sourceMappingURL=applyData.js.map