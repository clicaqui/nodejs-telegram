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
            const response = await this.request
                .get(`https://api.biblia.com/v1/bible/content/KJV.txt.txt?passage=${book}&key=${process.env.BOOK_KEY}`);
            if (response.status !== 200) {
                throw new Error(`Passage not found `);
            }
            else {
                return response.data + " " + book.replace('.', ':');
            }
        }
        catch (error) {
            return `Passage not found `;
        }
    }
}
exports.PassageService = PassageService;
//# sourceMappingURL=passage.js.map