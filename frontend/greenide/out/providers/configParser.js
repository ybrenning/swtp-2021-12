"use strict";
// Parses received config settings from webview into proper JSON
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigParser = void 0;
// the main webview Panel to work with
class ConfigParser {
    // receive call with ...
    // - Apply as current config (Apply,configs)
    // - Delete config number num (Delete,num)
    // - Load config number num (Load,num)
    // - Save as new config (Save,Configs)
    constructor(mode, num, config) {
        this.num = num;
        this.config = config;
        // depending on what mode (Apply, Delete, Load, Save)
        switch (mode) {
            // apply this config
            case 'Apply':
                applyConfig(config);
                break;
            // delete config number num
            case 'Delete':
                deleteConfig(num);
                break;
            // load config number num
            case 'Load':
                loadConfig(num);
                break;
            // save this config as new set
            default:
                saveConfig(config);
                break;
        }
    }
}
exports.ConfigParser = ConfigParser;
// apply provided config from checkboxes, set this as new configs set number 0
function applyConfig(config) {
    // define collection for data
    var obj = {
        addConfig: [{}]
    };
    // make string for json
    var json;
    const fs = require('fs');
    // check if 
    fs.readFile('/Users/ferris/PECK/kanzi-1.7.0/configurations/configuration.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        }
        else {
            obj.addConfig.push({ id: 0, name: 'Default', config: config });
            json = JSON.stringify(obj);
            fs.writeFile('/Users/ferris/PECK/kanzi-1.7.0/configurations/configuration.json', json, 'utf8', callback);
        }
    });
    throw new Error("Function not implemented.");
}
// delete this config number num
function deleteConfig(num) {
    throw new Error("Function not implemented.");
}
// load this config, set it as new config set number 0
function loadConfig(num) {
    throw new Error("Function not implemented.");
}
// save the provided config
function saveConfig(config) {
    throw new Error("Function not implemented.");
}
function callback(arg0, json, arg2, callback) {
    throw new Error("Function not implemented.");
}
//# sourceMappingURL=configParser.js.map