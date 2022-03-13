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
    
    constructor (line: number, character: number, characterEND: number) {

        this.line = line - 1;
        this.character = character;
        this.characterEND = characterEND;

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