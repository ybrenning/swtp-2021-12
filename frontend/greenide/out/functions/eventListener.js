"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventListener = void 0;
const vscode = require("vscode");
const extension_1 = require("../extension");
function eventListener(context) {
    // refresh methods when opening new file
    vscode.workspace.onDidOpenTextDocument(function () {
        // collect data from file and find methods
        context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ language: "java" }, new extension_1.JavaDocumentSymbolProvider()));
    });
    // refresh methods when changing tab to already opened file
    vscode.window.onDidChangeActiveTextEditor(function () {
        // collect data from file and find methods
        context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ language: "java" }, new extension_1.JavaDocumentSymbolProvider()));
    });
}
exports.eventListener = eventListener;
//# sourceMappingURL=eventListener.js.map