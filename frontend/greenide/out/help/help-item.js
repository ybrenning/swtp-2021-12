"use strict";
// For Sidepanel tree segment 'help'
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpItem = void 0;
const vscode = require("vscode");
class HelpItem extends vscode.TreeItem {
    constructor(label, collapsibleState, command, iconPath) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        super.command = command;
        super.iconPath = iconPath;
    }
}
exports.HelpItem = HelpItem;
//# sourceMappingURL=help-item.js.map