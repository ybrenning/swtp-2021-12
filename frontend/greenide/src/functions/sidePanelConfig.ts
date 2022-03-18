// This creates the side panel segment 'Configs' where the user can see which config elements are active
// there's also an element to click and open a webview to change the config with checkboxes or manage saved favorites / save a new favorite

import * as vscode from 'vscode';
import { ConfigsProvider } from '../providers/configs';
import { ConfigMenu } from '../webviews/configMenu';

const folder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];

export function sidePanelConfigs(context: vscode.ExtensionContext) {
    // Config data (default config 0)
    var config: string[] = [];

    // Read current config
    const fs = require('fs');
    var result = JSON.parse(fs.readFileSync(folder + '/greenide/configuration.json', 'utf8'));
    config = result.config[0].config;

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