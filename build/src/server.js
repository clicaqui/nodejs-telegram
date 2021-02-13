"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
(async () => {
    const server = new app_1.ServerSetup(3000);
    await server.init();
    server.start();
})();
//# sourceMappingURL=server.js.map