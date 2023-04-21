"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
class BookService {
    constructor(request) {
        this.request = request;
    }
    async findBook(book) {
        try {
            const retorno = await this.request
                .get(`http://findholybible-default-rtdb.firebaseio.com/${book}.json`);
            if (retorno.status == 200) {
                return retorno.data;
            }
            else {
                throw new Error("Passage not found");
            }
        }
        catch (err) {
            return err.message;
        }
    }
}
exports.BookService = BookService;
//# sourceMappingURL=book.js.map