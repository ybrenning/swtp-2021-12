import * as vscode from 'vscode';
import { HelpProvider } from './help/help-provider';

export async function registerProviders(context: vscode.ExtensionContext): Promise<void> {
    
    const helpProvider = new HelpProvider(context);
    helpProvider.registerProviders();
}
