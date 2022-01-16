"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigProvider = exports.ResourceType = void 0;
const vscode = require("vscode");
const authentication_provider_1 = require("../authentication/authentication-provider");
const config_input_1 = require("../inputs/config-input");
const product_input_1 = require("../inputs/product-input");
const workspace_configuration_provider_1 = require("../settings/workspace-configuration-provider");
var ResourceType;
(function (ResourceType) {
    ResourceType["unknown"] = "Unknown";
    ResourceType["product"] = "Product";
    ResourceType["config"] = "Config";
})(ResourceType = exports.ResourceType || (exports.ResourceType = {}));
class ConfigProvider {
    constructor(context, authenticationProvider, publicApiService, workspaceConfigurationProvider) {
        this.context = context;
        this.authenticationProvider = authenticationProvider;
        this.publicApiService = publicApiService;
        this.workspaceConfigurationProvider = workspaceConfigurationProvider;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            return this.getProducts();
        }
        if (element.resourceType === ResourceType.product) {
            return this.getConfigs(element.resourceId);
        }
        return Promise.resolve([]);
    }
    getProducts() {
        return Promise.all([
            this.authenticationProvider.getAuthenticationConfiguration(),
            this.workspaceConfigurationProvider.getWorkspaceConfiguration()
        ]).then(values => {
            const publicApiConfiguration = values[0];
            const workspaceConfiguration = values[1];
            if (!publicApiConfiguration || !workspaceConfiguration || !workspaceConfiguration.publicApiBaseUrl) {
                return [];
            }
            const statusBar = vscode.window.createStatusBarItem();
            statusBar.text = 'ConfigCat - Loading Products...';
            statusBar.show();
            const productsService = this.publicApiService.createProductsService(publicApiConfiguration, workspaceConfiguration.publicApiBaseUrl);
            return productsService.getProducts().then(products => {
                const items = products.body.map((p, index) => new Resource(p.productId ?? '', '', p.name ?? '', ResourceType.product, index === 0 ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed));
                statusBar.hide();
                if (!items.length) {
                    items.push(new Resource('-1', '', 'Could not find any Products.', ResourceType.unknown, vscode.TreeItemCollapsibleState.None));
                }
                return items;
            }, error => {
                vscode.window.showWarningMessage('Could not load Products. Error: ' + error + '. ' + (error?.response?.body ?? ''));
                statusBar.hide();
                return [new Resource('-1', '', 'Could not load Products.', ResourceType.unknown, vscode.TreeItemCollapsibleState.None)];
            });
        }, error => {
            return [];
        });
    }
    getConfigs(productId) {
        return Promise.all([
            this.authenticationProvider.getAuthenticationConfiguration(),
            this.workspaceConfigurationProvider.getWorkspaceConfiguration()
        ]).then(values => {
            const publicApiConfiguration = values[0];
            const workspaceConfiguration = values[1];
            if (!publicApiConfiguration || !workspaceConfiguration || !workspaceConfiguration.publicApiBaseUrl) {
                return [];
            }
            const statusBar = vscode.window.createStatusBarItem();
            statusBar.text = 'ConfigCat - Loading Configs...';
            statusBar.show();
            const configsService = this.publicApiService.createConfigsService(publicApiConfiguration, workspaceConfiguration.publicApiBaseUrl);
            return configsService.getConfigs(productId).then(configs => {
                const items = configs.body.map(c => new Resource(c.configId ?? '', productId, c.name ?? '', ResourceType.config, vscode.TreeItemCollapsibleState.None));
                statusBar.hide();
                if (!items.length) {
                    items.push(new Resource('-1', '', 'Could not find any Configs.', ResourceType.unknown, vscode.TreeItemCollapsibleState.None));
                }
                return items;
            }, error => {
                vscode.window.showWarningMessage('Could not load Configs. Error: ' + error + '. ' + (error?.response?.body ?? ''));
                statusBar.hide();
                return [new Resource('-1', '', 'Could not load Configs.', ResourceType.unknown, vscode.TreeItemCollapsibleState.None)];
            });
        }, error => {
            return [];
        });
    }
    async connectConfig(resource) {
        if (resource && resource.parentResourceId && resource.resourceId) {
            return await this.workspaceConfigurationProvider.setConfiguration(resource.parentResourceId, resource.resourceId);
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
        if (!authenticationConfiguration || !workspaceConfiguration || !workspaceConfiguration.publicApiBaseUrl) {
            return;
        }
        const productsService = this.publicApiService.createProductsService(authenticationConfiguration, workspaceConfiguration.publicApiBaseUrl);
        const products = await productsService.getProducts();
        let productId;
        try {
            productId = await product_input_1.ProductInput.pickProduct(products.body);
        }
        catch (error) {
            return;
        }
        if (!productId) {
            return;
        }
        const configsService = this.publicApiService.createConfigsService(authenticationConfiguration, workspaceConfiguration.publicApiBaseUrl);
        const configs = await configsService.getConfigs(productId);
        let configId;
        try {
            configId = await config_input_1.ConfigInput.pickConfig(configs.body);
        }
        catch (error) {
            return;
        }
        if (!configId) {
            return;
        }
        return await this.workspaceConfigurationProvider.setConfiguration(productId, configId);
    }
    async addConfig(resource) {
        let authenticationConfiguration = null;
        let workspaceConfiguration = null;
        try {
            authenticationConfiguration = await this.authenticationProvider.getAuthenticationConfiguration();
            workspaceConfiguration = await this.workspaceConfigurationProvider.getWorkspaceConfiguration();
        }
        catch (error) {
            return;
        }
        if (!authenticationConfiguration || !workspaceConfiguration || !workspaceConfiguration.publicApiBaseUrl) {
            return;
        }
        let productId = '';
        if (resource?.resourceType !== ResourceType.product) {
            const productsService = this.publicApiService.createProductsService(authenticationConfiguration, workspaceConfiguration.publicApiBaseUrl);
            const products = await productsService.getProducts();
            productId = await product_input_1.ProductInput.pickProduct(products.body);
        }
        else {
            productId = resource.resourceId;
        }
        if (!productId) {
            return;
        }
        let configName;
        try {
            configName = await config_input_1.ConfigInput.configInput();
        }
        catch (error) {
            return;
        }
        if (!configName) {
            return;
        }
        const configsService = this.publicApiService.createConfigsService(authenticationConfiguration, workspaceConfiguration.publicApiBaseUrl);
        let config = null;
        try {
            config = await configsService.createConfig(productId, { name: configName });
        }
        catch (error) {
            vscode.window.showWarningMessage('Could not create Config. Error: ' + error + '. ' + (error?.response?.body ?? ''));
        }
        if (!config || !config.body.configId) {
            return;
        }
        const connect = await config_input_1.ConfigInput.askConnect();
        if (connect !== 'Yes') {
            return;
        }
        return await this.workspaceConfigurationProvider.setConfiguration(productId, config.body.configId);
    }
    async openInDashboard(resource) {
        let authenticationConfiguration = null;
        let workspaceConfiguration = null;
        try {
            authenticationConfiguration = await this.authenticationProvider.getAuthenticationConfiguration();
            workspaceConfiguration = await this.workspaceConfigurationProvider.getWorkspaceConfiguration();
        }
        catch (error) {
            return;
        }
        if (!authenticationConfiguration || !workspaceConfiguration || !workspaceConfiguration.dashboardBaseUrl || !workspaceConfiguration.publicApiBaseUrl) {
            return;
        }
        if (resource && resource.parentResourceId && resource.resourceId) {
            return await vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(workspaceConfiguration.dashboardBaseUrl + '/'
                + resource.parentResourceId + '/' + resource.resourceId));
        }
        const productsService = this.publicApiService.createProductsService(authenticationConfiguration, workspaceConfiguration.publicApiBaseUrl);
        const products = await productsService.getProducts();
        let productId;
        try {
            productId = await product_input_1.ProductInput.pickProduct(products.body);
        }
        catch (error) {
            return;
        }
        if (!productId) {
            return;
        }
        const configsService = this.publicApiService.createConfigsService(authenticationConfiguration, workspaceConfiguration.publicApiBaseUrl);
        const configs = await configsService.getConfigs(productId);
        let configId;
        try {
            configId = await config_input_1.ConfigInput.pickConfig(configs.body);
        }
        catch (error) {
            return;
        }
        if (!configId) {
            return;
        }
        return await vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(workspaceConfiguration.dashboardBaseUrl + '/'
            + productId + '/' + configId));
    }
    registerProviders() {
        const treeView = vscode.window.createTreeView('configcat.configs', {
            treeDataProvider: this,
            showCollapseAll: true
        });
        this.context.subscriptions.push(treeView);
        this.context.subscriptions.push(vscode.commands.registerCommand('configcat.configs.refresh', () => this.refresh()));
        this.context.subscriptions.push(vscode.commands.registerCommand('configcat.configs.add', async (resource) => await this.addConfig(resource)));
        this.context.subscriptions.push(vscode.commands.registerCommand('configcat.configs.openInDashboard', async (resource) => await this.openInDashboard(resource)));
        this.context.subscriptions.push(vscode.commands.registerCommand('configcat.configs.connect', async (resource) => {
            await this.connectConfig(resource);
        }));
        this.context.subscriptions.push(this.context.secrets.onDidChange(e => {
            if (e.key === authentication_provider_1.AuthenticationProvider.secretKey) {
                this.refresh();
            }
        }));
        this.context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration(workspace_configuration_provider_1.WorkspaceConfigurationProvider.configurationKey)) {
                this.refresh();
            }
        }));
    }
}
exports.ConfigProvider = ConfigProvider;
class Resource extends vscode.TreeItem {
    constructor(resourceId, parentResourceId, label, resourceType, collapsibleState) {
        super(label, collapsibleState);
        this.resourceId = resourceId;
        this.parentResourceId = parentResourceId;
        this.label = label;
        this.resourceType = resourceType;
        this.collapsibleState = collapsibleState;
        super.contextValue = resourceType;
    }
}
//# sourceMappingURL=config-provider.js.map