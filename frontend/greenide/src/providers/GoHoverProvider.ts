// Hover Provider to display data above found method in code

import * as vscode from 'vscode';
import { getFunctions } from '../extension';

export class GoHoverProvider implements vscode.HoverProvider {
    

    public provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.Hover> {

        
        var functions: { 
            name: string; 
            method: string; 
            runtime: number[];
            energy: number[];
            kind: vscode.SymbolKind; 
            containerName: string; 
            location: vscode.Location;
        }[] = getFunctions();

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
                    var range = new vscode.Range(
                        new vscode.Position(functLine+1, functChar),
                        new vscode.Position(functLine+1, functCharEND)
                    );

                    var text = (functions[i].name + '\n\n'
                                + 'Results without Config' + '  \n'
                                + 'Runtime: ' + functions[i].runtime[0] + ' ms  \n'
                                + 'Energy: ' + functions[i].energy[0] + ' mWs\n\n'
                                + 'Results with Config' + '  \n'
                                + 'Runtime: ' + functions[i].runtime[1] + ' ms  \n'
                                + 'Energy: ' + functions[i].energy[1] + ' mWs\n\n'
                                + 'Total Difference' + '  \n'
                                + 'Runtime: ' + (functions[i].runtime[1] - functions[i].runtime[0]) + ' ms  \n'
                                + 'Energy: ' + (functions[i].energy[1] - functions[i].energy[0]) + ' mWs');

                    // execute hover
                    resolve(new vscode.Hover(text, range));
                }
            }
        });
    }
}
