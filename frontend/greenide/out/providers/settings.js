"use strict";
// Provider for settings segment
// Just two clickable elements to either parse another configItems.json or locatorItems.json
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsProvider = void 0;
const vscode = require("vscode");
const getFolder_1 = require("../functions/getFolder");
const folder = (0, getFolder_1.getFolder)();
class SettingsProvider {
    // Set the tree elements for side panel
    constructor() {
        // Create three items
        this.data = [
            new SettingsItem('Config Elements', 0),
            new SettingsItem('Locator Elements', 1),
            new SettingsItem('Configurations', 2),
            new SettingsItem('Software System', 3)
        ];
    }
    getTreeItem(element) {
        return element;
    }
    getChildren() {
        return this.data;
    }
}
exports.SettingsProvider = SettingsProvider;
// Class to create each item
class SettingsItem extends vscode.TreeItem {
    constructor(label, nr) {
        // Set the label for each element
        super(label);
        this.contextValue = 'treeItem';
        // Depending on which item, execute different command
        switch (nr) {
            case 0:
                this.command = {
                    title: "Settings Item",
                    command: "greenIDE-settings.click",
                    arguments: [folder + '/greenide/configItems.json']
                };
                break;
            case 1:
                this.command = {
                    title: "Settings Item",
                    command: "greenIDE-settings.click",
                    arguments: [folder + '/greenide/locatorItems.json']
                };
                break;
            case 2:
                this.command = {
                    title: "Settings Item",
                    command: "greenIDE-settings.click",
                    arguments: [folder + '/greenide/configuration.json']
                };
                break;
            case 3:
                this.command = {
                    title: "Settings Item",
                    command: "greenIDE-settings.click",
                    arguments: [folder + '/greenide/system.json']
                };
                break;
            default:
                break;
        }
    }
}
//# sourceMappingURL=settings.js.map