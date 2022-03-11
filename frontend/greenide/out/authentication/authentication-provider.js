"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationProvider = exports.contextIsAuthenticated = void 0;
const vscode = require("vscode");
const auth_input_1 = require("../inputs/auth-input");
exports.contextIsAuthenticated = 'configcat:authenticated';
class AuthenticationProvider {
    constructor(context, publicApiService, workspaceConfigurationProvider) {
        this.context = context;
        this.publicApiService = publicApiService;
        this.workspaceConfigurationProvider = workspaceConfigurationProvider;
        this.publicApiConfiguration = null;
    }
    async checkAuthenticated() {
        try {
            await this.getAuthenticationConfiguration();
            await vscode.commands.executeCommand('setContext', exports.contextIsAuthenticated, true);
        }
        catch (error) {
            await this.clear();
        }
    }
    async getAuthenticationConfiguration() {
        const credentialsString = await this.context.secrets.get(AuthenticationProvider.secretKey);
        if (!credentialsString) {
            return Promise.reject();
        }
        const credentials = JSON.parse(credentialsString);
        if (!credentials || !credentials.basicAuthUsername || !credentials.basicAuthPassword) {
            return Promise.reject();
        }
        return Promise.resolve(credentials);
    }
    async authenticate() {
        let configuration;
        try {
            configuration = await auth_input_1.AuthInput.getAuthParameters();
        }
        catch (error) {
            return null;
        }
        let workspaceConfiguration;
        try {
            workspaceConfiguration = await this.workspaceConfigurationProvider.getWorkspaceConfiguration();
        }
        catch (error) {
            return null;
        }
        if (!workspaceConfiguration || !workspaceConfiguration.publicApiBaseUrl) {
            return null;
        }
        const meService = this.publicApiService.createMeService(configuration, workspaceConfiguration.publicApiBaseUrl);
        try {
            const me = await meService.getMe();
            await this.context.secrets.store(AuthenticationProvider.secretKey, JSON.stringify(configuration));
            await vscode.window.showInformationMessage('Logged in to ConfigCat. Email: ' + me.body.email);
            return configuration;
        }
        catch (error) {
            await vscode.window.showWarningMessage('Could not log in to ConfigCat');
            return null;
        }
    }
    async logout() {
        await this.clear();
        vscode.window.showInformationMessage('Logged out from ConfigCat');
    }
    async clear() {
        await vscode.commands.executeCommand('setContext', exports.contextIsAuthenticated, false);
        await this.context.secrets.delete(AuthenticationProvider.secretKey);
    }
    registerProviders() {
        this.context.subscriptions.push(vscode.commands.registerCommand('configcat.login', async () => {
            await this.authenticate();
        }));
        this.context.subscriptions.push(vscode.commands.registerCommand('configcat.logout', async () => {
            await this.logout();
        }));
        this.context.subscriptions.push(this.context.secrets.onDidChange(async (e) => {
            if (e.key === AuthenticationProvider.secretKey) {
                await this.checkAuthenticated();
            }
        }));
    }
}
exports.AuthenticationProvider = AuthenticationProvider;
AuthenticationProvider.secretKey = 'configcat:publicapi-credentials';
//# sourceMappingURL=authentication-provider.js.map