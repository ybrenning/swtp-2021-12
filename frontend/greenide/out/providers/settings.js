"use strict";
// provider for settings segment
// just two clickable elements to either parse another configItems.json or locatorItems.json
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsProvider = void 0;
const vscode = require("vscode");
const folder = vscode.workspace.workspaceFolders?.map(folder => folder.uri.path)[0];
class SettingsProvider {
    // Set the tree elements for side panel
    constructor() {
        // Create three items
        this.data = [
            new SettingsItem('Config Elements', 0),
            new SettingsItem('Locator Elements', 1)
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
        // depending on which item, execute different command
        switch (nr) {
            case 0:
                this.command = {
                    title: "Settings Item",
                    command: "greenIDE-settings.click",
                    arguments: [folder + '/configurations/configItems.json']
                };
                break;
            case 1:
                this.command = {
                    title: "Settings Item",
                    command: "greenIDE-settings.click",
                    arguments: [folder + '/configurations/locatorItems.json']
                };
                break;
            default:
                break;
        }
    }
}
//# sourceMappingURL=settings.js.map