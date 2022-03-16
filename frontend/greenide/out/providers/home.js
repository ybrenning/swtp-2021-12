"use strict";
// provider for first tab in side panel, home
// start/reload greenIDE, see found methods, get data, activate syntax highlighting
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeProvider = void 0;
const vscode = require("vscode");
class HomeProvider {
    // Set the tree elements for side panel
    constructor(functions) {
        // if there are functions
        if (functions.length > 0) {
            // collect all functions found
            var sendData = [];
            for (var j = 0; j < functions.length; j++) {
                sendData.push(new HomeItem(functions[j].name, undefined, functions[j]));
            }
            // show methods or ...
            this.data = [
                new HomeItem('Found Methods:', sendData),
                new HomeItem('Highlight All Methods'),
                new HomeItem('Detailed Statistics')
            ];
        }
        else {
            // prompt to run/reload
            this.data = [
                new HomeItem('Run or Reload Extension')
            ];
        }
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (element === undefined) {
            return this.data;
        }
        return element.children;
    }
}
exports.HomeProvider = HomeProvider;
class HomeItem extends vscode.TreeItem {
    constructor(label, children, functionI) {
        super(label, children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded);
        this.contextValue = 'treeItem';
        // variables for each HomeItem
        this.children = children;
        this.line = functionI?.location.range.start.line;
        // the command that is executed when clicking on the HomeItem (if it is a child)
        if (this.line) {
            this.command = {
                title: "Highlight Method",
                command: "greenIDE-home.click",
                arguments: [functionI]
            };
        }
        else if (label.match('Detailed Statistics')) {
            this.command = {
                title: "Open Details",
                command: "greenIDE-home.overview",
            };
        }
        else if (label.match('Highlight All Methods')) {
            this.command = {
                title: "Highlight All Methods",
                command: "greenIDE-home.clickAll",
            };
        }
    }
}
//# sourceMappingURL=home.js.map