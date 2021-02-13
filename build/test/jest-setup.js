"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("@src/app");
const supertest_1 = __importDefault(require("supertest"));
let server;
beforeAll(async () => {
    server = new app_1.ServerSetup();
    server.init();
    global.testRequest = supertest_1.default(server.getApp());
});
//# sourceMappingURL=jest-setup.js.map