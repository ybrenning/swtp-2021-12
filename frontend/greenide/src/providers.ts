import * as vscode from 'vscode';
import { HelpProvider } from './help/help-providers';

export async function registerProviders(context: vscode.ExtensionContext): Promise<void> {
    
    const helpProvider = new HelpProvider(context);
    helpProvider.registerProviders();
}
