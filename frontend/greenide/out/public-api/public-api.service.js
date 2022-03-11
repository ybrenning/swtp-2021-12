"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicApiService = void 0;
const configcat_publicapi_node_client_1 = require("configcat-publicapi-node-client");
class PublicApiService {
    createMeService(configuration, basePath) {
        return new configcat_publicapi_node_client_1.MeApi(configuration.basicAuthUsername, configuration.basicAuthPassword, basePath ?? PublicApiService.defaultBasePath);
    }
    createProductsService(configuration, basePath) {
        return new configcat_publicapi_node_client_1.ProductsApi(configuration.basicAuthUsername, configuration.basicAuthPassword, basePath ?? PublicApiService.defaultBasePath);
    }
    createConfigsService(configuration, basePath) {
        return new configcat_publicapi_node_client_1.ConfigsApi(configuration.basicAuthUsername, configuration.basicAuthPassword, basePath ?? PublicApiService.defaultBasePath);
    }
    createEnvironmentsService(configuration, basePath) {
        return new configcat_publicapi_node_client_1.EnvironmentsApi(configuration.basicAuthUsername, configuration.basicAuthPassword, basePath ?? PublicApiService.defaultBasePath);
    }
    createSettingsService(configuration, basePath) {
        return new configcat_publicapi_node_client_1.FeatureFlagsSettingsApi(configuration.basicAuthUsername, configuration.basicAuthPassword, basePath ?? PublicApiService.defaultBasePath);
    }
}
exports.PublicApiService = PublicApiService;
PublicApiService.defaultBasePath = 'https://api.configcat.com';
//# sourceMappingURL=public-api.service.js.map