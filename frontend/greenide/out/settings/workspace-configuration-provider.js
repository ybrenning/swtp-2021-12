"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceConfigurationProvider = void 0;
const vscode = require("vscode");
class WorkspaceConfigurationProvider {
    constructor(context) {
        this.context = context;
    }
    async setConfiguration(productId, configId) {
        const config = vscode.workspace.getConfiguration(WorkspaceConfigurationProvider.configurationKey);
        await config.update('productId', productId);
        await config.update('configId', configId);
    }
    async checkConfiguration() {
        try {
            const configuration = await this.getWorkspaceConfiguration();
            await vscode.commands.executeCommand('setContext', WorkspaceConfigurationProvider.connectedContextKey, configuration?.configId && configuration?.productId && configuration?.publicApiBaseUrl && configuration?.dashboardBaseUrl);
        }
        catch {
            await vscode.commands.executeCommand('setContext', WorkspaceConfigurationProvider.connectedContextKey, false);
        }
    }
    getWorkspaceConfiguration() {
        const config = vscode.workspace.getConfiguration(WorkspaceConfigurationProvider.configurationKey);
        const productId = config.get('productId');
        const configId = config.get('configId');
        const publicApiBaseUrl = config.get('publicApiBaseUrl');
        const dashboardBaseUrl = config.get('dashboardBaseUrl');
        return Promise.resolve({
            productId: String(productId),
            configId: String(configId),
            publicApiBaseUrl: String(publicApiBaseUrl),
            dashboardBaseUrl: String(dashboardBaseUrl),
        });
    }
    registerProviders() {
        this.context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(async (e) => {
            if (e.affectsConfiguration(WorkspaceConfigurationProvider.configurationKey)) {
                await this.checkConfiguration();
            }
        }));
    }
}
exports.WorkspaceConfigurationProvider = WorkspaceConfigurationProvider;
WorkspaceConfigurationProvider.configurationKey = 'configcat';
WorkspaceConfigurationProvider.connectedContextKey = 'configcat:connected';
//# sourceMappingURL=workspace-configuration-provider.js.map