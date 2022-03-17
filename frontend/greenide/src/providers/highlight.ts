// Provider to toggle highlight
// Highlights parsed location in code

import * as vscode from 'vscode';

// Colors for the highlight
const green: string = '#018217';
const yellow: string = '#ffec1c';
const red: string = '#d40000';

export class MethodHighlight {
    line: number;
    character: number;
    characterEND: number;
    
    constructor (line: number, character: number, characterEND: number) {
        this.line = line - 1;
        this.character = character;
        this.characterEND = characterEND;
        this.decorate();
    }

    // Does the syntax highlighting at provided location
    decorate() {
        // TODO: implement from example online
        // The type, what color and other stuff
        var decorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: yellow,
        });

        // Has to be an array
        let decorationsArray: vscode.DecorationOptions[] = [];

        // Range for decoration
        let range = new vscode.Range(
            new vscode.Position(this.line, this.character),
            new vscode.Position(this.line, this.characterEND)
        );

        // Declaration unit
        let decoration = { range };

        // Add range to decorations
        decorationsArray.push(decoration);

        // Execute decoration
        vscode.window.activeTextEditor?.setDecorations(decorationType , decorationsArray);
    }
}
