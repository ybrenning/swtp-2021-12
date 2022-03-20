"use strict";
// Provider to toggle highlight
// Highlights parsed location in code
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodHighlight = void 0;
const vscode = require("vscode");
// Colors for the highlight
const green = '#007512';
const yellow = '#fbd304';
const red = '#a80000';
class MethodHighlight {
    constructor(line, character, characterEND, runtime, energy) {
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
        if (this.runtime[1] < 20) {
            color = green;
        }
        else if (this.runtime[1] >= 20 && this.runtime[1] < 50) {
            color = yellow;
        }
        else if (this.runtime[1] >= 50) {
            color = red;
        }
        // The type, what color and other stuff
        var decorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: color,
        });
        // Has to be an array
        let decorationsArray = [];
        // Range for decoration
        let range = new vscode.Range(new vscode.Position(this.line, this.character), new vscode.Position(this.line, this.characterEND));
        // Declaration unit
        let decoration = { range };
        // Add range to decorations
        decorationsArray.push(decoration);
        // Execute decoration
        vscode.window.activeTextEditor?.setDecorations(decorationType, decorationsArray);
    }
}
exports.MethodHighlight = MethodHighlight;
//# sourceMappingURL=highlight.js.map