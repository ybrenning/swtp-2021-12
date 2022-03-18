"use strict";
// This creates the side panel segment 'Configs' where the user can see which config elements are active
// there's also an element to click and open a webview to change the config with checkboxes or manage saved favorites / save a new favorite
Object.defineProperty(exports, "__esModule", { value: true });
exports.sidePanelConfigs = void 0;
const vscode = require("vscode");
const configs_1 = require("../providers/configs");
const configMenu_1 = require("../webviews/configMenu");
const folder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];
function sidePanelConfigs(context) {
    // Config data (default config 0)
    var config = [];
    // Read current config
    const fs = require('fs');
    var result = JSON.parse(fs.readFileSync(folder + '/greenide/configuration.json', 'utf8'));
    config = result.config[0].config;
    // Creates tree view for second segment of side panel, place for configs
    var configsTreeView = vscode.window.createTreeView("greenIDE-configs", {
        treeDataProvider: new configs_1.ConfigsProvider(config)
    });
    // Set name for second segment
    configsTreeView.title = 'CONFIGURATIONS';
    // Button to open menu for configs, to select configs, save favorites or delete favorites
    let clickEvent = vscode.commands.registerCommand('greenIDE-config.menu', () => {
        // Open webview 'ConfigMenu'
        configMenu_1.ConfigMenu.createOrShow(context.extensionUri);
    });
    context.subscriptions.push(clickEvent);
    context.subscriptions.push(configsTreeView);
}
exports.sidePanelConfigs = sidePanelConfigs;
//# sourceMappingURL=sidePanelConfig.js.map