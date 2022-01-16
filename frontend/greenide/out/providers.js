"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerProviders = void 0;
const help_providers_1 = require("./help/help-providers");
async function registerProviders(context) {
    const helpProvider = new help_providers_1.HelpProvider(context);
    helpProvider.registerProviders();
}
exports.registerProviders = registerProviders;
//# sourceMappingURL=providers.js.map