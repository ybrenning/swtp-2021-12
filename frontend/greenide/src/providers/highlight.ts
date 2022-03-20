// Provider to toggle highlight
// Highlights parsed location in code

import * as vscode from 'vscode';

// Colors for the highlight
const green: string = '#007512';
const yellow: string = '#fbd304';
const red: string = '#a80000';

export class MethodHighlight {
    line: number;
    character: number;
    characterEND: number;
    runtime: number[];
    energy: number[];
    
    constructor (line: number, character: number, characterEND: number, runtime: number[], energy: number[]) {
        this.line = line - 1;
        this.character = character;
        this.characterEND = characterEND;
        this.runtime = runtime;
        this.energy = energy;
        this.decorate();
    }

    // Does the syntax highlighting at provided location
    decorate() {

        // set color
        var color;
        if (this.runtime[1] < 20 && this.runtime[1] !== 0) {
            color = green;
        } else if ((this.runtime[1] >= 20 && this.runtime[1] < 50)  || this.runtime[1] === 0) {
            color = yellow;
        } else if (this.runtime[1] >= 50) {
            color = red;
        }

        // The type, what color and other stuff
        var decorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: color,
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
