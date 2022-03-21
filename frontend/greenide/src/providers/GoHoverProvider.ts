// Hover Provider to display data above found method in code

import * as vscode from 'vscode';
import { getFunctions } from '../extension';

export class GoHoverProvider implements vscode.HoverProvider {
    
    // execute hovering field
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
        return new Promise((resolve) => {

            // check line for functions comparison
            var line = position.line + 1;

            // for every method, check location and execute hover if mouse is in line on method
            for (let i = 0; i < functions.length; i++) {

                // shorten the data for better implementation
                var functLine = functions[i].location.range.start.line;
                var functChar = functions[i].location.range.start.character;
                var functCharEND = functions[i].location.range.end.character;

                // if mouse is in line
                if (line === functLine) {

                    // Range where hover is active (on the method)
                    var range = new vscode.Range(
                        new vscode.Position(functLine+1, functChar),
                        new vscode.Position(functLine+1, functCharEND)
                    );

                    // text to display
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
