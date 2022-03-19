import * as vscode from 'vscode';
import { JavaDocumentSymbolProvider } from '../extension';

export function eventListener(context: vscode.ExtensionContext){

    // refresh methods when opening new file
    vscode.workspace.onDidOpenTextDocument(function() {

        // collect data from file and find methods
        context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
            { language: "java" }, new JavaDocumentSymbolProvider()
        ));
    });

    // refresh methods when changing tab to already opened file
    vscode.window.onDidChangeActiveTextEditor(function() {

        // collect data from file and find methods
        context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
            { language: "java" }, new JavaDocumentSymbolProvider()
        ));
    });
}