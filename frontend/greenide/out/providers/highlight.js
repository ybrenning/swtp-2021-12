"use strict";
// Provider to toggle highlight
// Highlights parsed location in code
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodHighlight = void 0;
const vscode = require("vscode");
// Colors for the highlight
const green = '#018217';
const yellow = '#ffec1c';
const red = '#d40000';
class MethodHighlight {
    constructor(line, character, characterEND) {
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