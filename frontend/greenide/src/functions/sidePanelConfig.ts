// This creates the side panel segment 'Configs' where the user can see which config elements are active
// there's also an element to click and open a webview to change the config with checkboxes or manage saved favorites / save a new favorite

import * as vscode from 'vscode';
import { ConfigsProvider } from '../providers/configs';
import { ConfigMenu } from '../webviews/configMenu';
import { getFolder } from './getFolder';

const folder = getFolder();

export async function sidePanelConfigs(context: vscode.ExtensionContext) {

    // Config data (default config 0)
    var config: string[] = [];

    // Read current config
    const fs = require('fs');

    // if file exists, get active config
    if (fs.existsSync(folder + '/greenide/configuration.json')) {

        // read config.json and apply active config
        var data = fs.readFileSync(folder + '/greenide/configuration.json');
        var result = JSON.parse(data);
        config = result.config[0].config;

        // else create file
    } else {

        // initiate file
        var obj = {
            config: [] as any
        };

        // Set data for obj
        obj.config.push({ id: 0, name: 'Active', config: [] });
        var json = JSON.stringify(obj, null, '\t');
        fs.writeFile(folder + '/greenide/configuration.json', json, 'utf8', callback);
    }

    // Creates tree view for second segment of side panel, place for configs
    var configsTreeView = vscode.window.createTreeView("greenIDE-configs", {
        treeDataProvider: new ConfigsProvider(config)
    });

    // Set name for second segment
    configsTreeView.title = 'CONFIGURATIONS';

    // Button to open menu for configs, to select configs, save favorites or delete favorites
    let clickEvent = vscode.commands.registerCommand('greenIDE-config.menu', () => {
        // Open webview 'ConfigMenu'
        ConfigMenu.createOrShow(context.extensionUri);
    });

    context.subscriptions.push(clickEvent);
    context.subscriptions.push(configsTreeView);
}

function callback(arg0: string, obj: { config: any; }, arg2: string, callback: any) { }