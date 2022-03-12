// Provider to toggle highlight
// highlights parsed location in code

import * as vscode from 'vscode';

// colors for the highlight
const green: string = '#018217';
const yellow: string = '#ffec1c';
const red: string = '#d40000';

export class MethodHighlight {

    line: number;
    character: number;
    characterEND: number;
    
    constructor (functionI: { name: string; kind: vscode.SymbolKind; containerName: string; location: vscode.Location; }) {

        this.line = functionI.location.range.start.line - 1;
        this.character = functionI.location.range.start.character;
        this.characterEND = functionI.location.range.end.character;

        this.decorate();
    }

    // does the syntax highlighting at provided location
    decorate() {

        // TODO: implement from example online

            // the type, what color and other stuff
            var decorationType = vscode.window.createTextEditorDecorationType({
                backgroundColor: yellow,
            });

            // has to be an array
            let decorationsArray: vscode.DecorationOptions[] = [];

            // range for decoration
            let range = new vscode.Range(
                new vscode.Position(this.line, this.character),
                new vscode.Position(this.line, this.characterEND)
            );

            // declara declaration unit
            let decoration = { range };

            // add range to decorations
            decorationsArray.push(decoration);

            // execute decoration
            vscode.window.activeTextEditor?.setDecorations(decorationType , decorationsArray);
    }
}