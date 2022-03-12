"use strict";
// Provider to toggle highlight
// highlights parsed location in code
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodHighlight = void 0;
const vscode = require("vscode");
// colors for the highlight
const green = '#018217';
const yellow = '#ffec1c';
const red = '#d40000';
class MethodHighlight {
    constructor(functionI) {
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
        let decorationsArray = [];
        // range for decoration
        let range = new vscode.Range(new vscode.Position(this.line, this.character), new vscode.Position(this.line, this.characterEND));
        // declara declaration unit
        let decoration = { range };
        // add range to decorations
        decorationsArray.push(decoration);
        // execute decoration
        vscode.window.activeTextEditor?.setDecorations(decorationType, decorationsArray);
    }
}
exports.MethodHighlight = MethodHighlight;
//# sourceMappingURL=highlight.js.map