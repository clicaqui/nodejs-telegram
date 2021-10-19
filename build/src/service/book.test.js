"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const book_1 = require("./book");
jest.mock('axios');
describe('Fetch from BOOK return obj', () => {
    it('cliente ', () => {
        const retorno = {
            data: ["Genesis", "Exodus", "Leviticus"],
        };
        axios_1.default.get = jest.fn().mockResolvedValue(retorno);
        const book = 'OLDBOOKS';
        const passageService = new book_1.BookService(axios_1.default);
        const response = passageService.findBook(book);
        expect(axios_1.default.get).toHaveBeenCalledWith("http://findholybible-default-rtdb.firebaseio.com/OLDBOOKS.json");
    });
});
//# sourceMappingURL=book.test.js.map