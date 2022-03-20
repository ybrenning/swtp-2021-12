"use strict";
// Hover Provider to display data above found method in code
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoHoverProvider = void 0;
const vscode = require("vscode");
const extension_1 = require("../extension");
class GoHoverProvider {
    provideHover(document, position, token) {
        var functions = (0, extension_1.getFunctions)();
        // document: currently open document, position: current position of cursor
        // Both change dynamically as the user interacts with VSC so the methods also have to be dynamic
        return new Promise((resolve) => {
            var line = position.line + 1;
            // TEST suite
            console.log('LINE FROM HOVERPROVIDER: ' + line);
            console.log('LINE FROM FUNCTIONS: ' + functions[0].location.range.start.line);
            for (let i = 0; i < functions.length; i++) {
                var functLine = functions[i].location.range.start.line;
                var functChar = functions[i].location.range.start.character;
                var functCharEND = functions[i].location.range.end.character;
                if (line === functLine) {
                    // Range where hover is active
                    var range = new vscode.Range(new vscode.Position(functLine + 1, functChar), new vscode.Position(functLine + 1, functCharEND));
                    var text = (functions[i].name + '  \n'
                        + 'Runtime: ' + functions[i].runtime[1] + ' ms  \n'
                        + 'Energy: ' + functions[i].energy[1] + ' mWs');
                    // execute hover
                    resolve(new vscode.Hover(text, range));
                }
            }
            /*var displaytext: string = "";

            // Determines what information to show and saves it to displaytext
            var line = position.line + 1;

            if (line === 29) {
                displaytext = ('Energy: TEST 1');
            };

            if (line === 37) {
                displaytext = ('Energy: TEST 2');
            };

            resolve(new vscode.Hover(displaytext));*/
        });
    }
}
exports.GoHoverProvider = GoHoverProvider;
//# sourceMappingURL=GoHoverProvider.js.map