"use strict";
// Provider for third tab in side panel, help
// instructions on how to use greenIDE, commands, links etc.
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpProvider = void 0;
const vscode = require("vscode");
class HelpProvider {
    // Set the tree elements for side panel
    constructor() {
        // Create three items
        this.data = [
            new HelpItem('[↪︎] GitLab', 0),
            new HelpItem('[↪︎] How To Use', 1),
            new HelpItem('[↪︎] Contact Us', 2)
        ];
    }
    getTreeItem(element) { return element; }
    getChildren() { return this.data; }
}
exports.HelpProvider = HelpProvider;
// Class to create each item
class HelpItem extends vscode.TreeItem {
    constructor(label, nr) {
        // Set the label for each element
        super(label);
        this.contextValue = 'treeItem';
        // Depending on which item, execute different command
        switch (nr) {
            case 0:
                this.command = {
                    title: "Help Item",
                    command: "greenIDE-help.click",
                    arguments: ['https://git.informatik.uni-leipzig.de/swtp-21-22/swt-p-ws-2020-2021/swtp-2021-12']
                };
                break;
            case 1:
                this.command = {
                    title: "Help Item",
                    command: "greenIDE-help.click",
                    arguments: ['https://sites.google.com/view/eonar/help']
                };
                break;
            case 2:
                this.command = {
                    title: "Help Item",
                    command: "greenIDE-help.click",
                    arguments: ['https://sites.google.com/view/eonar/contact']
                };
                break;
            default:
                break;
        }
    }
}
//# sourceMappingURL=help.js.map