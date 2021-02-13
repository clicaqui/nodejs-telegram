"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassageService = exports.ServiceError = void 0;
class ServiceError extends Error {
    constructor(message) {
        const internalMessage = 'Unexpected error when trying to comunicate to PassageBible';
        super(`${internalMessage}:${message}`);
    }
}
exports.ServiceError = ServiceError;
class PassageService {
    constructor(request) {
        this.request = request;
    }
    async findPassage(book, mensagem) {
        try {
            await this.request
                .get(`http://api.biblia.com/v1/bible/content/KJV.txt.txt?passage=${book}&key=${process.env.BOOK_KEY}`)
                .then((retorno) => {
                if (retorno.status !== 200) {
                    mensagem = `Passage not found `;
                }
                else {
                    mensagem = retorno.data + ' ' + book.replace('.', ':');
                }
            });
        }
        catch (error) {
            throw new ServiceError(error.message);
        }
        return mensagem;
    }
}
exports.PassageService = PassageService;
//# sourceMappingURL=passage.js.map