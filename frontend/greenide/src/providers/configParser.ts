// Parses received config settings from webview into proper JSON

import * as vscode from "vscode";
import { ConfigMenu } from "../webviews/configMenu";

const folder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];

// The main webview Panel to work with
export class ConfigParser {

    // Number of config set
    num?: number;

    // The provided config from webview checkboxes
    config?: string[];

    // Extension URI to refresh webview
    extensionUri: vscode.Uri;

    // Receive call with ...
    // - Apply as current config (Apply,configs)
    // - Delete config number num (Delete,num)
    // - Load config number num (Load,num)
    // - Save as new config (Save,Configs)
    constructor(extensionUri: vscode.Uri, mode: string, num?: number, config?: string[]) {
        this.num = num;
        this.config = config;
        this.extensionUri = extensionUri;

        // Depending on what mode (Apply, Delete, Load, Save)
        switch (mode) {
            // Apply this config
            case 'Apply':
                applyConfig(config,extensionUri);
                break;
            // Delete config number num
            case 'Delete':
                deleteConfig(num,extensionUri);
                break;
            // Load config number num
            case 'Load':
                loadConfig(num,extensionUri);
                break;
            // Save this config as new set
            default:
                saveConfig(config,extensionUri);
                break;
        }
    }
}

// Apply provided config from checkboxes, set this as new configs set number 0
function applyConfig(config: string[] | undefined, extensionUri: vscode.Uri) {
    // Define collection for data
    var obj = {
        config: [] as any
    };

    // Make string for json
    var json: string;

    const fs = require('fs');

    // Overwrite file / default config num 0
    fs.readFile(folder + '/configurations/configuration.json', 'utf8', function readFileCallback(err: any, data: string) {
        if (err) {
            console.log(err);
        } else {
            if (data.length !== 0) {
                // Get the current configs
                var result = JSON.parse(data);

                // Set data for obj
                obj.config.push({ id: 0, name: 'Active', config: config });

                // Replace first config with obj config
                result.config[0] = obj.config[0];

                // Write new default config into file
                json = JSON.stringify(result);
                fs.writeFile(folder + '/configurations/configuration.json', json, 'utf8', callback);
            } else {
                // Set data for obj
                obj.config.push({ id: 0, name: 'Active', config: config });
                json = JSON.stringify(obj);
                fs.writeFile(folder + '/configurations/configuration.json', json, 'utf8', callback);
            }
        }
    });

    // Open webview 'ConfigMenu'
    ConfigMenu.currentPanel?.dispose();
    ConfigMenu.createOrShow(extensionUri);
}

// Delete this config number num
function deleteConfig(num: number | undefined, extensionUri: vscode.Uri) {
    const fs = require('fs');
    // Read file to get configs
    fs.readFile(folder + '/configurations/configuration.json', 'utf8', function readFileCallback(err: any, data: string) {
        if (err) {
            console.log(err);
        } else {
            // Get JSON data
            var result = JSON.parse(data);
            // Index of config number num
            var index = -1;
            index = result.config.findIndex((obj: { id: number | undefined; }) => obj.id === num);

            // Check if id was found
            if (index === -1) {
                throw new Error('Config Not Found');
            } else {
                // Splice for 1 spot at found index
                result.config.splice(index,1);

                // Translate to JSON and write into file
                var json = JSON.stringify(result);
                fs.writeFile(folder + '/configurations/configuration.json', json, 'utf8', callback);
            }
        }
    });

    // Open webview 'ConfigMenu'
    ConfigMenu.currentPanel?.dispose();
    ConfigMenu.createOrShow(extensionUri);
}

// Load this config, set it as new config set number 0
function loadConfig(num: number | undefined, extensionUri: vscode.Uri) {
    const fs = require('fs');

    // Read file to get configs
    fs.readFile(folder + '/configurations/configuration.json', 'utf8', function readFileCallback(err: any, data: string) {
        if (err) {
            console.log(err);
        } else {
            // Get JSON data
            var result = JSON.parse(data);

            // Index of config number num
            var index = -1;
            index = result.config.findIndex((obj: { id: number | undefined; }) => obj.id === num);

            // Check if id was found
            if (index === -1) {
                throw new Error('Config Not Found');
            } else {
                result.config[0] = { id: 0, name: 'Active', config: result.config[index].config };

                // Translate to JSON and write into file
                var json = JSON.stringify(result);
                fs.writeFile(folder + '/configurations/configuration.json', json, 'utf8', callback);
            }
        } 
    });

    // Open webview 'ConfigMenu'
    ConfigMenu.currentPanel?.dispose();
    ConfigMenu.createOrShow(extensionUri);
}

// Save the provided config
function saveConfig(config: string[] | undefined, extensionUri: vscode.Uri) {
    // Define collection for data
    var obj = {
        config: [] as any
    };

    // Make string for json
    var json: string;

    const fs = require('fs');

    // Overwrite file / default config num 0
    fs.readFile(folder + '/configurations/configuration.json', 'utf8', function readFileCallback(err: any, data: string) {
        if (err) {
            console.log(err);
        } else {
            if (data.length !== 0) {
                // TEST suite
                var result = JSON.parse(data);
                var ids: number[] = [];
                var id: number = 0;

                // Get all the ids to see what's the next smallest id to save as
                for (let i = 0; i < Object.keys(result.config).length; i++) {
                    ids.push(result.config[i].id);
                }

                // TODO: does only save default value (0) for id, then the next time it works
                // problem: ids list is compared with numbers, but all are different, so no new number
                // assign id as smallest id not taken
                for (let i = 0; i < Object.keys(result.config).length+1; i++) {
                    if (!(ids.includes(i))) {
                        id = i;
                    }
                }

                // Get the current configs
                obj = JSON.parse(data);

                // Set name for config
                var name = 'Config ' + id;

                // Set data for obj
                obj.config[0] = ({ id: 0, name: 'Active', config: config });
                obj.config.push({ id: id, name: name, config: config });

                // Write new default config into file
                json = JSON.stringify(obj);
                fs.writeFile(folder + '/configurations/configuration.json', json, 'utf8', callback);
            } else {
                // Set data for obj
                obj.config.push({ id: 0, name: 'Active', config: config });
                obj.config.push({ id: 1, name: 'Config 1', config: config });

                json = JSON.stringify(obj);
                fs.writeFile(folder + '/configurations/configuration.json', json, 'utf8', callback);
            }
        }   
    });

    // Open webview 'ConfigMenu'
    ConfigMenu.currentPanel?.dispose();
    ConfigMenu.createOrShow(extensionUri);
}

// Just for file reasons, not to be implemented
function callback(arg0: string, json: string, arg2: string, callback: any) { }
