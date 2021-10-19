"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
class BookService {
    constructor(request) {
        this.request = request;
    }
    async findBook(book) {
        const retorno = await this.request
            .get(`http://findholybible-default-rtdb.firebaseio.com/${book}.json`);
        return retorno.data;
    }
}
exports.BookService = BookService;
//# sourceMappingURL=book.js.map