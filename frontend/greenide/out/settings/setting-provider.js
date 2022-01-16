"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingProvider = void 0;
const vscode = require("vscode");
const authentication_provider_1 = require("../authentication/authentication-provider");
const environment_input_1 = require("../inputs/environment-input");
const setting_input_1 = require("../inputs/setting-input");
const public_api_service_1 = require("../public-api/public-api.service");
const webpanel_1 = require("../webpanel/webpanel");
const workspace_configuration_provider_1 = require("./workspace-configuration-provider");
class SettingProvider {
    constructor(context, authenticationProvider, publicApiService, workspaceConfigurationProvider) {
        this.context = context;
        this.authenticationProvider = authenticationProvider;
        this.publicApiService = publicApiService;
        this.workspaceConfigurationProvider = workspaceConfigurationProvider;
        this.treeView = null;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    async refresh() {
        this.refreshSettings();
        await this.refreshHeader();
    }
    async refreshHeader() {
        try {
            const publicApiConfiguration = await this.authenticationProvider.getAuthenticationConfiguration();
            const workspaceConfiguration = await this.workspaceConfigurationProvider.getWorkspaceConfiguration();
            if (!publicApiConfiguration || !workspaceConfiguration
                || !workspaceConfiguration.publicApiBaseUrl || !workspaceConfiguration.configId) {
                this.setDescription(undefined);
                return;
            }
            const configsService = this.publicApiService.createConfigsService(publicApiConfiguration, workspaceConfiguration.publicApiBaseUrl);
            const config = await configsService.getConfig(workspaceConfiguration.configId);
            this.setDescription(config.body.name || '');
        }
        catch (error) {
            this.setDescription(undefined);
        }
    }
    refreshSettings() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (element) {
            return Promise.resolve([]);
        }
        return Promise.all([
            this.authenticationProvider.getAuthenticationConfiguration(),
            this.workspaceConfigurationProvider.getWorkspaceConfiguration()
        ]).then(values => {
            this.setMessage(undefined);
            const statusBar = vscode.window.createStatusBarItem();
            statusBar.text = 'ConfigCat - Loading Settings...';
            statusBar.show();
            const publicApiConfiguration = values[0];
            const workspaceConfiguration = values[1];
            if (!publicApiConfiguration || !workspaceConfiguration
                || !workspaceConfiguration.publicApiBaseUrl || !workspaceConfiguration.configId) {
                statusBar.hide();
                return [];
            }
            const settingsService = this.publicApiService.createSettingsService(publicApiConfiguration, workspaceConfiguration.publicApiBaseUrl);
            return settingsService.getSettings(workspaceConfiguration.configId).then(settings => {
                const items = settings.body.map((s, index) => new Resource(String(s.settingId), s.key ?? '', s.name ?? '', s.hint ?? '', vscode.TreeItemCollapsibleState.None));
                statusBar.hide();
                return items;
            }, (error) => {
                vscode.window.showWarningMessage('Could not load Settings. Error: ' + error + '. ' + (error?.response?.body ?? ''));
                statusBar.hide();
                this.setMessage('Could not load Settings.');
                return [];
            });
        }, () => {
            return [];
        });
    }
    async addSetting() {
        let publicApiConfiguration;
        let workspaceConfiguration;
        try {
            publicApiConfiguration = await this.authenticationProvider.getAuthenticationConfiguration();
            workspaceConfiguration = await this.workspaceConfigurationProvider.getWorkspaceConfiguration();
        }
        catch (error) {
            return;
        }
        if (!publicApiConfiguration || !workspaceConfiguration || !workspaceConfiguration.publicApiBaseUrl || !workspaceConfiguration.configId) {
            return;
        }
        let setting;
        try {
            setting = await setting_input_1.SettingInput.settingInput();
        }
        catch (error) {
            return;
        }
        if (!setting) {
            return;
        }
        const statusBar = vscode.window.createStatusBarItem();
        statusBar.text = 'ConfigCat - Creating Feature Flag...';
        statusBar.show();
        const settingsService = new public_api_service_1.PublicApiService().createSettingsService(publicApiConfiguration, workspaceConfiguration.publicApiBaseUrl);
        try {
            await settingsService.createSetting(workspaceConfiguration.configId, setting);
            this.refreshSettings();
            statusBar.hide();
        }
        catch (error) {
            vscode.window.showWarningMessage('Could not create Feature Flag. Error: ' + error + '. ' + (error?.response?.body ?? ''));
            statusBar.hide();
        }
    }
    async openInDashboard() {
        let workspaceConfiguration;
        try {
            workspaceConfiguration = await this.workspaceConfigurationProvider.getWorkspaceConfiguration();
        }
        catch (error) {
            return;
        }
        if (!workspaceConfiguration || !workspaceConfiguration.dashboardBaseUrl || !workspaceConfiguration.configId || !workspaceConfiguration.productId) {
            return;
        }
        return await vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(workspaceConfiguration.dashboardBaseUrl + '/'
            + workspaceConfiguration.productId + '/' + workspaceConfiguration.configId));
    }
    async openSettingPanel(resource) {
        if (!resource) {
            return;
        }
        let authenticationConfiguration = null;
        let workspaceConfiguration = null;
        try {
            authenticationConfiguration = await this.authenticationProvider.getAuthenticationConfiguration();
            workspaceConfiguration = await this.workspaceConfigurationProvider.getWorkspaceConfiguration();
        }
        catch (error) {
            return;
        }
        if (!authenticationConfiguration
            || !workspaceConfiguration
            || !workspaceConfiguration.publicApiBaseUrl
            || !workspaceConfiguration.configId
            || !workspaceConfiguration.productId) {
            return;
        }
        const environmentsService = this.publicApiService.createEnvironmentsService(authenticationConfiguration, workspaceConfiguration.publicApiBaseUrl);
        const environments = await environmentsService.getEnvironments(workspaceConfiguration.productId);
        let environmentId;
        try {
            environmentId = await environment_input_1.EnvironmentInput.pickEnvironment(environments.body);
        }
        catch (error) {
            return;
        }
        if (!environmentId) {
            return;
        }
        const environmentName = environments.body.filter(e => e.environmentId === environmentId)[0].name;
        new webpanel_1.WebPanel(this.context, authenticationConfiguration, workspaceConfiguration, environmentId, environmentName || '', +resource.resourceId, resource.key);
    }
    setMessage(message) {
        if (!this.treeView) {
            return;
        }
        this.treeView.message = message;
    }
    setDescription(description) {
        if (!this.treeView) {
            return;
        }
        if (description) {
            this.treeView.title = description;
            this.treeView.description = 'FEATURE FLAGS & SETTINGS';
        }
        else {
            this.treeView.title = `FEATURE FLAGS & SETTINGS`;
            this.treeView.description = undefined;
        }
    }
    async registerProviders() {
        this.treeView = vscode.window.createTreeView('configcat.settings', {
            treeDataProvider: this,
            showCollapseAll: true
        });
        this.context.subscriptions.push(this.treeView);
        this.context.subscriptions.push(vscode.commands.registerCommand('configcat.settings.refresh', async () => await this.refresh()));
        this.context.subscriptions.push(vscode.commands.registerCommand('configcat.settings.openInDashboard', async () => await this.openInDashboard()));
        this.context.subscriptions.push(vscode.commands.registerCommand('configcat.settings.copyToClipboard', (resource) => vscode.env.clipboard.writeText(resource.key)));
        this.context.subscriptions.push(vscode.commands.registerCommand('configcat.settings.findUsages', (resource) => vscode.commands.executeCommand('search.action.openNewEditor', { query: resource.label })));
        this.context.subscriptions.push(vscode.commands.registerCommand('configcat.settings.values', (resource) => this.openSettingPanel(resource)));
        this.context.subscriptions.push(vscode.commands.registerCommand('configcat.settings.add', async () => await this.addSetting()));
        this.context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(async (e) => {
            if (e.affectsConfiguration(workspace_configuration_provider_1.WorkspaceConfigurationProvider.configurationKey)) {
                await this.refresh();
            }
        }));
        this.context.subscriptions.push(this.context.secrets.onDidChange(async (e) => {
            if (e.key === authentication_provider_1.AuthenticationProvider.secretKey) {
                await this.refresh();
            }
        }));
        await this.refreshHeader();
    }
}
exports.SettingProvider = SettingProvider;
class Resource extends vscode.TreeItem {
    constructor(resourceId, key, name, hint, collapsibleState) {
        super(key, collapsibleState);
        this.resourceId = resourceId;
        this.key = key;
        this.name = name;
        this.hint = hint;
        this.collapsibleState = collapsibleState;
        super.description = name;
        super.tooltip = hint;
        super.contextValue = 'Setting';
    }
}
//# sourceMappingURL=setting-provider.js.map