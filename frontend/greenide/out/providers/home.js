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
                sendData.push(new HomeItem(functions[j].name));
            }
            // TEST suite
            console.log(functions);
            this.data = [new HomeItem('Found Methods:', sendData)];
        }
        else {
            this.data = [new HomeItem('Run or Reload Extension')];
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
    constructor(label, children) {
        super(label, children === undefined ? vscode.TreeItemCollapsibleState.None :
            vscode.TreeItemCollapsibleState.Expanded);
        // TODO: parse location when command is executed
        this.command = {
            "title": "Reveal Method",
            "command": "greenIDE-home.click",
        };
        this.contextValue = 'treeItem';
        this.children = children;
    }
}
//# sourceMappingURL=home.js.map