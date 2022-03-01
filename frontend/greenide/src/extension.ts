// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';
import * as vscode from 'vscode';
import { WebviewPanel } from './WebviewPanel';
import { HomeProvider } from './providers/home';
import { ConfigsProvider } from './providers/configs';
import { HelpProvider } from './providers/help';
import { removeAllListeners } from 'process';
import { kMaxLength } from 'buffer';
import lineReader = require('line-reader');

var foundMethods: string[] = [];
var functions: {
    name: string;
    kind: vscode.SymbolKind;
    containerName: string;
    location: vscode.Location;
}[] = [];

var config: number = 0;

// Values of the Analysis
type Datum = {
    energy: number,
    time: number
};

var function1Data: Datum;
var function2Data: Datum;
var function3Data: Datum;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // auto start extension
    vscode.commands.executeCommand('greenIDE.run');

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "greenide" is now active!');


    // TODO: Auto run extension / command on startup
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('greenIDE.run', () => {
        // The code you place here will be executed every time your command is executed
        // Starts procedure and updates webview panel
        runAnalysis();

        // side panel segments loading
        sidePanelHome();
        sidePanelConfigs();
        sidePanelHelp();

        // old webview panel
        // WebviewPanel.createOrShow(context.extensionUri);
    });

    context.subscriptions.push(disposable);

    function sidePanelHome() {
    
        // creates tree view for first segment of side panel, home of extension actions
        var homeTreeView = vscode.window.createTreeView( "greenIDE-home", {
            treeDataProvider: new HomeProvider(functions) 
        });
    
        // Set name for first segment
        homeTreeView.title = 'GREENIDE';
        homeTreeView.description = 'Run GreenIDE:';

        let clickEvent = vscode.commands.registerCommand('greenIDE-home.click', ( url ) => {

            // TODO: implement reveal on click, url should be parsed in home.ts command
            vscode.env.openExternal( vscode.Uri.parse( url ));
        });
    
        context.subscriptions.push(clickEvent);
        context.subscriptions.push(homeTreeView);
    }
    
    function sidePanelConfigs() {
    
        // creates tree view for second segment of side panel, place for configs
        var configsTreeView = vscode.window.createTreeView( "greenIDE-configs", {
            treeDataProvider: new ConfigsProvider 
        });
    
        // Set name for second segment
        configsTreeView.title = 'CONFIGURATIONS';
        configsTreeView.message = 'Choose Configs:';

        context.subscriptions.push(configsTreeView);
    }
    
    function sidePanelHelp() {
    
        // creates tree view for third segment of side panel, get instructions, commands, help links etc
        var helpTreeView = vscode.window.createTreeView( "greenIDE-help", {
            treeDataProvider: new HelpProvider 
        });
    
        // Set name for third segment
        helpTreeView.title = 'HELP';
        helpTreeView.message = 'How To use';

        context.subscriptions.push(helpTreeView);
    }

    
    
    

    // Start DocumentSymbolProvider to find methods
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
        { language: "java" }, new JavaDocumentSymbolProvider()
    ));

    // Start Hover Provider to create hovers
    context.subscriptions.push(vscode.languages.registerHoverProvider(
        { language: "java" }, new GoHoverProvider()
    ));
}

// Performs analysis
// Procedure order:
//  1. retreive funtions, (done)
//  2. provide methods to backend,
//  3. retreive analysis from backend,
//  4. display results(Webview and syntax highlighting)
function runAnalysis() {
    // header for understanding methods output
    console.log('Found Kanzi Methods');
    console.log('Name, line, start pos, end pos');

    // Display the found "kanzi." methods from java source code
    for (var i = 0; i < functions.length; i++) {
        console.log(
            functions[i].name,                              // name of found kanzi method
            functions[i].location.range.start.line,         // line of found kanzi method
            functions[i].location.range.start.character,    // starting column of found kanzi method
            functions[i].location.range.end.character       // ending column of found kanzi method
        );
    }

    console.log('Start Test');
    // TODO: do procedure order
    for (var j = 0; j < foundMethods.length; j++) {
        console.log(foundMethods[j]);
    }
    console.log('End Test');
}



// Implementation of documentSymbolProvider to find all parts of code containing 'kanzi.'
class JavaDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): Thenable<vscode.SymbolInformation[]> {
        return new Promise((resolve) => {
            var symbols = [];
            var containerNumber = 0;

            // TODO: replace kanzilist elements with all elements of method_list.txt (all kanzi methods)
            // Find from list imported Kanzi, e.g. kanzi.util.hash.XXHash32
            // then find implemented method, e.g. from kanzi...hash32 --> .hash()
                // Problem: if object is created, find method applied to that object, just that object
                // idea: top down brackets, search for created objects with second last segment (e.g. XXHash32 created as hash, save name of object)
                // then search for method applied to that object inside of brackets (count closing brackets, +1 if opening, -1 if closing, if <0 break)
                // if method is found applied to object (e.g. 'hash.hash(' ) this is the wanted method


            // SEVERAL KANZI LISTS TO OPERATE
            // kanzilistFULL: original kanzi list, imported from file (e.g. JSON)
            // kanzilistIMP: sliced off after last dot to find implementations
            // kanzilistMET: all the methods
            // kanzilist: the implementations and their belonging methods

            // TODO: convert method_list.txt to array to iterate
            // trying with json-file, next step: iterating search over kanzilist
            // current version: hardcode list of kanzi methods
            var kanzilistFULL = ["kanzi.Global$1.compare()","kanzi.Global.<clinit>()","kanzi.Global.computeHistogramOrder0()","kanzi.Global.computeHistogramOrder1()","kanzi.Global.initSquash()","kanzi.Global.initStretch()","kanzi.Global.log2()","kanzi.Global.log2_1024()","kanzi.Global.positiveOrNull()","kanzi.Global.sortFilesByPathAndSize()","kanzi.Global.squash()","kanzi.Memory$BigEndian.readLong64()","kanzi.Memory$BigEndian.writeInt32()","kanzi.Memory$BigEndian.writeLong64()","kanzi.Memory$LittleEndian.readInt16()","kanzi.Memory$LittleEndian.readInt32()","kanzi.Memory$LittleEndian.readLong64()","kanzi.Memory.<clinit>()","kanzi.SliceByteArray.<init>()","kanzi.SliceByteArray.<init>(byte[ ], int)()","kanzi.SliceByteArray.<init>(byte[ ], int, int)()","kanzi.app.BlockCompressor$FileCompressTask.call()","kanzi.app.BlockCompressor$FileCompressTask.dispose()","kanzi.app.BlockCompressor$FileCompressWorker.call()","kanzi.app.BlockCompressor.<init>()","kanzi.app.BlockCompressor.call()","kanzi.app.BlockCompressor.printOut()","kanzi.app.Kanzi.createFileList()","kanzi.app.Kanzi.main()","kanzi.app.Kanzi.printOut()","kanzi.app.Kanzi.processCommandLine()","kanzi.bitstream.DefaultOutputBitStream.<init>()","kanzi.bitstream.DefaultOutputBitStream.close()",
                         "kanzi.bitstream.DefaultOutputBitStream.flush()","kanzi.bitstream.DefaultOutputBitStream.isClosed()","kanzi.bitstream.DefaultOutputBitStream.pushCurrent()","kanzi.bitstream.DefaultOutputBitStream.writeBit()","kanzi.bitstream.DefaultOutputBitStream.writeBits(byte[ ], int, int)()","kanzi.bitstream.DefaultOutputBitStream.writeBits(long, int)()","kanzi.bitstream.DefaultOutputBitStream.written()","kanzi.entropy.ANSRangeEncoder$Symbol.reset()","kanzi.entropy.ANSRangeEncoder.<init>(kanzi.OutputBitStream, int)()","kanzi.entropy.ANSRangeEncoder.<init>(kanzi.OutputBitStream, int, int, int)()","kanzi.entropy.ANSRangeEncoder.dispose()","kanzi.entropy.ANSRangeEncoder.encode()","kanzi.entropy.ANSRangeEncoder.encodeChunk()","kanzi.entropy.ANSRangeEncoder.encodeHeader()","kanzi.entropy.ANSRangeEncoder.rebuildStatistics()","kanzi.entropy.ANSRangeEncoder.updateFrequencies()","kanzi.entropy.BinaryEntropyEncoder.<init>()","kanzi.entropy.BinaryEntropyEncoder.dispose()","kanzi.entropy.BinaryEntropyEncoder.encode()","kanzi.entropy.BinaryEntropyEncoder.encodeBit()","kanzi.entropy.BinaryEntropyEncoder.encodeByte()","kanzi.entropy.BinaryEntropyEncoder.flush()","kanzi.entropy.CMPredictor.<init>()","kanzi.entropy.CMPredictor.get()",
                         "kanzi.entropy.CMPredictor.update()","kanzi.entropy.EntropyCodecFactory.getType()","kanzi.entropy.EntropyCodecFactory.newEncoder()","kanzi.entropy.EntropyUtils$FreqSortData.<init>()","kanzi.entropy.EntropyUtils$FreqSortData.compareTo()","kanzi.entropy.EntropyUtils$FreqSortData.compareTo(kanzi.entropy.EntropyUtils$FreqSortData)()","kanzi.entropy.EntropyUtils.<init>()","kanzi.entropy.EntropyUtils.computeFirstOrderEntropy1024()","kanzi.entropy.EntropyUtils.encodeAlphabet()","kanzi.entropy.EntropyUtils.normalizeFrequencies()","kanzi.entropy.EntropyUtils.writeVarInt()","kanzi.entropy.ExpGolombEncoder.<init>()","kanzi.entropy.ExpGolombEncoder.encodeByte()","kanzi.entropy.HuffmanCommon.generateCanonicalCodes()","kanzi.entropy.HuffmanEncoder.<init>(kanzi.OutputBitStream)()","kanzi.entropy.HuffmanEncoder.<init>(kanzi.OutputBitStream, int)()","kanzi.entropy.HuffmanEncoder.computeCodeLengths()","kanzi.entropy.HuffmanEncoder.computeInPlaceSizesPhase1()","kanzi.entropy.HuffmanEncoder.computeInPlaceSizesPhase2()","kanzi.entropy.HuffmanEncoder.dispose()","kanzi.entropy.HuffmanEncoder.encode()","kanzi.entropy.HuffmanEncoder.updateFrequencies()","kanzi.entropy.LogisticAdaptiveProbMap.<init>()","kanzi.entropy.LogisticAdaptiveProbMap.get()",
                         "kanzi.entropy.NullEntropyEncoder.<init>()","kanzi.entropy.NullEntropyEncoder.dispose()","kanzi.entropy.NullEntropyEncoder.encode()","kanzi.entropy.RangeEncoder.<init>(kanzi.OutputBitStream)()","kanzi.entropy.RangeEncoder.<init>(kanzi.OutputBitStream, int, int)()","kanzi.entropy.RangeEncoder.encode()","kanzi.entropy.RangeEncoder.encodeByte()","kanzi.entropy.RangeEncoder.encodeHeader()","kanzi.entropy.RangeEncoder.rebuildStatistics()","kanzi.entropy.RangeEncoder.updateFrequencies()","kanzi.entropy.TPAQPredictor$Mixer.<init>()","kanzi.entropy.TPAQPredictor$Mixer.get()","kanzi.entropy.TPAQPredictor$Mixer.update()","kanzi.entropy.TPAQPredictor.<init>()","kanzi.entropy.TPAQPredictor.createContext()","kanzi.entropy.TPAQPredictor.findMatch()","kanzi.entropy.TPAQPredictor.get()","kanzi.entropy.TPAQPredictor.getMatchContextPred()","kanzi.entropy.TPAQPredictor.update()","kanzi.function.BWTBlockCodec.<init>()","kanzi.function.BWTBlockCodec.forward()","kanzi.function.BWTBlockCodec.getMaxEncodedLength()","kanzi.function.ByteFunctionFactory.getName()","kanzi.function.ByteFunctionFactory.getType()","kanzi.function.ByteFunctionFactory.getTypeToken()","kanzi.function.ByteFunctionFactory.newFunction()","kanzi.function.ByteFunctionFactory.newFunctionToken()",
                         "kanzi.function.ByteTransformSequence.<init>()","kanzi.function.ByteTransformSequence.forward()","kanzi.function.ByteTransformSequence.getMaxEncodedLength()","kanzi.function.ByteTransformSequence.getNbFunctions()","kanzi.function.ByteTransformSequence.getSkipFlags()","kanzi.function.LZCodec$LZPCodec.<init>()","kanzi.function.LZCodec$LZPCodec.forward()","kanzi.function.LZCodec$LZXCodec.<init>()","kanzi.function.LZCodec$LZXCodec.arrayChunkCopy()","kanzi.function.LZCodec$LZXCodec.emitLastLiterals()","kanzi.function.LZCodec$LZXCodec.emitLength()","kanzi.function.LZCodec$LZXCodec.emitLiterals()","kanzi.function.LZCodec$LZXCodec.forward()","kanzi.function.LZCodec$LZXCodec.getMaxEncodedLength()","kanzi.function.LZCodec$LZXCodec.hash()","kanzi.function.LZCodec.<init>()","kanzi.function.LZCodec.differentInts()","kanzi.function.LZCodec.forward()","kanzi.function.LZCodec.getMaxEncodedLength()","kanzi.function.NullFunction.<init>()","kanzi.function.NullFunction.doCopy()","kanzi.function.NullFunction.forward()","kanzi.function.NullFunction.getMaxEncodedLength()","kanzi.function.RLT.<init>()","kanzi.function.RLT.emitRunLength()","kanzi.function.RLT.forward()","kanzi.function.RLT.getMaxEncodedLength()","kanzi.function.ROLZCodec$ROLZCodec1.<init>()",
                         "kanzi.function.ROLZCodec$ROLZCodec1.<init>(int)()","kanzi.function.ROLZCodec$ROLZCodec1.emitTokens()","kanzi.function.ROLZCodec$ROLZCodec1.findMatch()","kanzi.function.ROLZCodec$ROLZCodec1.forward()","kanzi.function.ROLZCodec$ROLZCodec1.getMaxEncodedLength()","kanzi.function.ROLZCodec$ROLZCodec2.<init>()","kanzi.function.ROLZCodec$ROLZCodec2.<init>(int)()","kanzi.function.ROLZCodec$ROLZCodec2.findMatch()","kanzi.function.ROLZCodec$ROLZCodec2.forward()","kanzi.function.ROLZCodec$ROLZCodec2.getMaxEncodedLength()","kanzi.function.ROLZCodec$ROLZEncoder.<init>()","kanzi.function.ROLZCodec$ROLZEncoder.dispose()","kanzi.function.ROLZCodec$ROLZEncoder.encodeBit()","kanzi.function.ROLZCodec$ROLZEncoder.encodeBits()","kanzi.function.ROLZCodec$ROLZEncoder.reset()","kanzi.function.ROLZCodec$ROLZEncoder.setContext()","kanzi.function.ROLZCodec$ROLZEncoder.setMode()","kanzi.function.ROLZCodec.<init>()","kanzi.function.ROLZCodec.forward()","kanzi.function.ROLZCodec.getKey()","kanzi.function.ROLZCodec.getMaxEncodedLength()","kanzi.function.ROLZCodec.hash()","kanzi.function.SRT.<init>()","kanzi.function.SRT.encodeHeader()","kanzi.function.SRT.forward()","kanzi.function.SRT.getMaxEncodedLength()","kanzi.function.SRT.preprocess()",
                         "kanzi.function.TextCodec$DictEntry.<init>()","kanzi.function.TextCodec$TextCodec1.<init>()","kanzi.function.TextCodec$TextCodec1.emitSymbols()","kanzi.function.TextCodec$TextCodec1.emitWordIndex()","kanzi.function.TextCodec$TextCodec1.expandDictionary()","kanzi.function.TextCodec$TextCodec1.forward()","kanzi.function.TextCodec$TextCodec1.getMaxEncodedLength()","kanzi.function.TextCodec$TextCodec1.reset()","kanzi.function.TextCodec$TextCodec2.<init>()","kanzi.function.TextCodec$TextCodec2.emitSymbols()","kanzi.function.TextCodec$TextCodec2.emitWordIndex()","kanzi.function.TextCodec$TextCodec2.expandDictionary()","kanzi.function.TextCodec$TextCodec2.forward()","kanzi.function.TextCodec$TextCodec2.getMaxEncodedLength()","kanzi.function.TextCodec$TextCodec2.reset()","kanzi.function.TextCodec.<init>()","kanzi.function.TextCodec.computeStats()","kanzi.function.TextCodec.createDictionary()","kanzi.function.TextCodec.forward()","kanzi.function.TextCodec.getMaxEncodedLength()","kanzi.function.TextCodec.isDelimiter()","kanzi.function.TextCodec.isLowerCase()","kanzi.function.TextCodec.isText()","kanzi.function.TextCodec.isUpperCase()","kanzi.function.TextCodec.sameWords()","kanzi.function.X86Codec.<init>()","kanzi.function.X86Codec.forward()",
                         "kanzi.function.X86Codec.getMaxEncodedLength()","kanzi.function.ZRLT.<init>()","kanzi.function.ZRLT.forward()","kanzi.function.ZRLT.getMaxEncodedLength()","kanzi.io.CompressedOutputStream$CustomByteArrayOutputStream.<init>()","kanzi.io.CompressedOutputStream$EncodingTask.<init>()","kanzi.io.CompressedOutputStream$EncodingTask.call()","kanzi.io.CompressedOutputStream$EncodingTask.encodeBlock()","kanzi.io.CompressedOutputStream$Status.<init>()","kanzi.io.CompressedOutputStream.<init>()","kanzi.io.CompressedOutputStream.close()","kanzi.io.CompressedOutputStream.getWritten()","kanzi.io.CompressedOutputStream.processBlock()","kanzi.io.CompressedOutputStream.write(byte[ ], int, int)()","kanzi.io.CompressedOutputStream.write(int)()","kanzi.io.CompressedOutputStream.writeHeader()","kanzi.transform.BWT.<init>()","kanzi.transform.BWT.forward()","kanzi.transform.BWT.getBWTChunks()","kanzi.transform.BWT.getPrimaryIndex()","kanzi.transform.BWT.maxBlockSize()","kanzi.transform.BWT.setPrimaryIndex()","kanzi.transform.BWTS.<init>()","kanzi.transform.BWTS.forward()","kanzi.transform.BWTS.maxBlockSize()","kanzi.transform.BWTS.moveLyndonWordHead()","kanzi.transform.DivSufSort$Stack.<init>()","kanzi.transform.DivSufSort$Stack.pop()",
                         "kanzi.transform.DivSufSort$Stack.push()","kanzi.transform.DivSufSort$Stack.size()","kanzi.transform.DivSufSort$TRBudget.<init>(int, int)()","kanzi.transform.DivSufSort$TRBudget.check()","kanzi.transform.DivSufSort.<init>()","kanzi.transform.DivSufSort.computeSuffixArray()","kanzi.transform.DivSufSort.constructSuffixArray()","kanzi.transform.DivSufSort.reset()","kanzi.transform.DivSufSort.sortTypeBstar()","kanzi.transform.DivSufSort.ssBlockSwap()","kanzi.transform.DivSufSort.ssCompare(int, int, int)()","kanzi.transform.DivSufSort.ssCompare(int, int, int, int)()","kanzi.transform.DivSufSort.ssFixDown()","kanzi.transform.DivSufSort.ssHeapSort()","kanzi.transform.DivSufSort.ssIlg()","kanzi.transform.DivSufSort.ssInsertionSort()","kanzi.transform.DivSufSort.ssMedian3()","kanzi.transform.DivSufSort.ssMedian5()","kanzi.transform.DivSufSort.ssMergeBackward()","kanzi.transform.DivSufSort.ssMultiKeyIntroSort()","kanzi.transform.DivSufSort.ssPartition()","kanzi.transform.DivSufSort.ssPivot()","kanzi.transform.DivSufSort.ssSort()","kanzi.transform.DivSufSort.ssSwapMerge()","kanzi.transform.DivSufSort.swapInSA()","kanzi.transform.DivSufSort.trCopy()","kanzi.transform.DivSufSort.trFixDown()","kanzi.transform.DivSufSort.trHeapSort()",
                         "kanzi.transform.DivSufSort.trIlg()","kanzi.transform.DivSufSort.trInsertionSort()","kanzi.transform.DivSufSort.trIntroSort()","kanzi.transform.DivSufSort.trMedian3()","kanzi.transform.DivSufSort.trMedian5()","kanzi.transform.DivSufSort.trPartition()","kanzi.transform.DivSufSort.trPivot()","kanzi.transform.DivSufSort.trSort()","kanzi.transform.SBRT.<init>()","kanzi.transform.SBRT.forward()","kanzi.util.hash.XXHash32.hash()"];

            // first sublist: slice at the last dot to check for implemenation
            // second sublist: take second part after slice for methods
            var kanzilistIMP = [];  // names for implementation
            var kanzilistMET = [];  // names for methods
            for (var n2 = 0; n2 < kanzilistFULL.length; n2++) {
                var index = kanzilistFULL[n2].lastIndexOf('.');
                kanzilistIMP[n2] = kanzilistFULL[n2].slice(0, index);
                kanzilistMET[n2] = kanzilistFULL[n2].slice(index + 1);
            }

            // purge duplicates in kanzilistIMP
            /*let kanzilistIMPwD: string[] = [];
            kanzilistIMP.forEach((i) => {
                if (!kanzilistIMPwD.includes(i)) {
                    kanzilistIMPwD.push(i);
                }
            });*/

            // Two dimensional list of kanzi methods to find methods after implementation
            var kanzilist = [];
            for (var k = 0; k < kanzilistIMP.length; k++) {
                kanzilist.push([kanzilistIMP[k],kanzilistMET[k]]);
            }

            // test kanzilist
            var kanziOutput: any = [];
            for (var t = 0; t < kanzilist.length; t++) {
                console.log(kanzilist[t][0] + ' ' + kanzilist[t][1]);
            }
            console.log('End of Kanzilist');

            // MECHANIC

            // Find "kanzi." in document/code
            // for each line in code
            for (var i = 0; i < document.lineCount; i++) {
                var line = document.lineAt(i);
                // find kanzi method
                for (var temp = 0; temp < kanzilistFULL.length; temp++)

                    // TODO: cut from kanzi.[...] to namely method with _function()

                    // if kanzi method is in line
                    {if (line.text.includes('import ' + kanzilistFULL[temp])) {

                        for (var j = 0; j < line.text.length; j++) {
                            if (!line.text.substring(j).includes(' ' + kanzilistFULL[temp])) {
                                // // Search for end of full kanzi name
                                // for (var k = j; k < line.text.length; k++) {
                                //     if (line.text.substring(j-1, k).includes(";")) {
                                //         // Add found kanzi name and location to object
                                symbols.push({
                                    // Substring only grabbing kanzi method name without braces
                                    // name: line.text.substr(j-1, (k-1) - (j-1)),
                                    name: kanzilistFULL[temp],
                                    kind: vscode.SymbolKind.Method,
                                    containerName: containerNumber.toString(),
                                    location: new vscode.Location(document.uri, new vscode.Range(new vscode.Position(i + 1, j + 1), new vscode.Position(i + 1, j + kanzilistFULL[temp].length + 1)))
                                });

                                foundMethods[containerNumber] = kanzilistFULL[temp];
                                containerNumber++;
                            
                                break;
                            }
                        }
                    }}
            }
            // Save symbols (all kanzi methods with metadata)
            functions = symbols;
            resolve(symbols);
        });
    }
}



class GoHoverProvider implements vscode.HoverProvider {
    public provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.Hover> {
        // document: currently open document, position: current position of cursor
        // Both change dynamically as the user interacts with VSC so the methods also have to be dynamic
        return new Promise((resolve) => {
            var displaytext: string = "";

            // Keep here for actual implementation
            /*
            switch(config) { 
                case 1: { 
                    for(var funct in functions) {
                        if(funct.location.line == position.line) {
                            displaytext = function1Data
                        }
                    }
                    break; 
                } 
                case 2: { 
                   //statements; 
                   break; 
                } 
                case 3: {
        
                    break;
                }
                default: { 
                    
                   break; 
                } 
            } 
            */

            // Determines what information to show and saves it to displaytext
            var line = position.line + 1;

            if (line === 29) {
                displaytext = ('Energy: ' + function1Data.energy.toString() + 'mWs   Time: ' + function1Data.time.toString() + 'ms');
            };

            if (line === 30) {
                displaytext = ('Energy: ' + function1Data.energy.toString() + 'mWs   Time: ' + function1Data.time.toString() + 'ms');
            };

            if (line === 36) {
                displaytext = ('Energy: ' + function2Data.energy.toString() + 'mWs   Time: ' + function2Data.time.toString() + 'ms');
            };

            if (line === 37) {
                displaytext = ('Energy: ' + function2Data.energy.toString() + 'mWs   Time: ' + function2Data.time.toString() + 'ms');
            };

            resolve(new vscode.Hover(displaytext));
        });
    }
}

// This method is called when your extension is deactivated
export function deactivate() { }