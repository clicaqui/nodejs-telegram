"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const passage_1 = require("./passage");
jest.mock('axios');
describe('Fetch from API return obj', () => {
    it('cliente ', () => {
        const retorno = {
            data: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
        };
        axios_1.default.get = jest.fn().mockResolvedValue(retorno);
        const passage = 'John1.1';
        const passageService = new passage_1.PassageService(axios_1.default);
        const response = passageService.findPassage(passage, '');
        expect(response).resolves.toEqual(retorno);
    });
    it('network failed', async () => {
        const errormsg = { message: 'Request failed with status code 403' };
        axios_1.default.get = jest.fn().mockRejectedValue(errormsg);
        const passage = 'John1.1';
        const passageService = new passage_1.PassageService(axios_1.default);
        await expect(passageService.findPassage(passage, '')).rejects.toThrow('Request failed with status code 403');
    });
});
//# sourceMappingURL=passage.test.js.map