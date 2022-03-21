"use strict";
// Provider for second tab in side panel, configs
// drop down / tree view for all methods to apply, save methods in favorites
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigsProvider = void 0;
const vscode = require("vscode");
class ConfigsProvider {
    // Set the tree elements for side panel
    constructor(config) {
        // read the config.json and get current active config elements
        var sendData = [];
        for (var j = 0; j < config.length; j++) {
            sendData.push(new ConfigItem(config[j], undefined));
        }
        // The data, consisting of two elements
        //  - the tree itself with the current active config elements
        //  - and the button to toggle webview
        this.data = [
            new ConfigItem('Current Config:', sendData),
            new ConfigItem('Open Config Menu')
        ];
    }
    getTreeItem(element) { return element; }
    getChildren(element) {
        if (element === undefined) {
            return this.data;
        }
        return element.children;
    }
}
exports.ConfigsProvider = ConfigsProvider;
class ConfigItem extends vscode.TreeItem {
    constructor(label, children) {
        super(label, children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded);
        this.contextValue = 'treeItem';
        // Variables for each ConfigItem
        this.children = children;
        // The command that is executed when clicking on the HomeItem (if it is a child)
        if (this.label === 'Open Config Menu') {
            this.command = {
                title: "Config Menu",
                command: "greenIDE-config.menu"
            };
        }
    }
}
//# sourceMappingURL=configs.js.map