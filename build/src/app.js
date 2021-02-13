"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerSetup = void 0;
require("./util/module-alias");
const core_1 = require("@overnightjs/core");
const body_parser_1 = __importDefault(require("body-parser"));
const passage_1 = require("./controller/passage");
class ServerSetup extends core_1.Server {
    constructor(port = 3000) {
        super(process.env.NODE_ENV === 'development');
        this.port = port;
    }
    init() {
        this.setUpExpress();
        this.setUpControllers();
    }
    setUpExpress() {
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
    }
    setUpControllers() {
        const passageController = new passage_1.PassageControler('');
        this.addControllers([passageController]);
    }
    getApp() {
        return this.app;
    }
    start() {
        this.port = process.env.PORT;
        this.app.listen(this.port, () => {
            console.info('Servidor ouvindo na porta', this.port);
        });
    }
}
exports.ServerSetup = ServerSetup;
//# sourceMappingURL=app.js.map