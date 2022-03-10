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
                sendData.push(new HomeItem(functions[j].name, undefined, functions[j].location.range.start.line - 1, functions[j].location.range.start.character));
            }
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
    constructor(label, children, line, character) {
        super(label, children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded);
        this.contextValue = 'treeItem';
        this.children = children;
        this.line = line;
        this.character = character;
        this.command = {
            title: "Reveal Method",
            command: "greenIDE-home.click",
            arguments: [line, character]
        };
    }
}
//# sourceMappingURL=home.js.map