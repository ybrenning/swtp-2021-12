"use strict";
// For Sidepanel tree segment 'help'
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpProvider = void 0;
const vscode = require("vscode");
const help_item_1 = require("./help-item");
class HelpProvider {
    constructor(context) {
        this.context = context;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            const infoElement = new help_item_1.HelpItem('Info & Download', vscode.TreeItemCollapsibleState.None, {
                command: 'vscode.open', title: 'Extension Information & Download',
                arguments: [vscode.Uri.parse('https://sites.google.com/view/eonar/home')]
            }, '$(info)');
            const helpElement = new help_item_1.HelpItem('Help', vscode.TreeItemCollapsibleState.None, {
                command: 'vscode.open', title: 'Get Help',
                arguments: [vscode.Uri.parse('https://sites.google.com/view/eonar/help')]
            }, '$(info)');
            const contactElement = new help_item_1.HelpItem('Contact Us', vscode.TreeItemCollapsibleState.None, {
                command: 'vscode.open', title: 'Contact Us',
                arguments: [vscode.Uri.parse('https://sites.google.com/view/eonar/')]
            }, '$(info)');
            return Promise.resolve([infoElement, helpElement, contactElement]);
        }
        return Promise.resolve([]);
    }
    registerProviders() {
        const help = vscode.window.createTreeView('greenide.help', {
            treeDataProvider: this
        });
        this.context.subscriptions.push(help);
    }
}
exports.HelpProvider = HelpProvider;
//# sourceMappingURL=help-providers.js.map