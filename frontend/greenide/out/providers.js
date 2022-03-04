"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerProviders = void 0;
const help_provider_1 = require("./help/help-provider");
async function registerProviders(context) {
    const helpProvider = new help_provider_1.HelpProvider(context);
    helpProvider.registerProviders();
}
exports.registerProviders = registerProviders;
//# sourceMappingURL=providers.js.map