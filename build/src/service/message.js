"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
class MessageService {
    constructor(request) {
        this.request = request;
    }
    async send(message, reply) {
        await this.request
            .post(`https://api.telegram.org/bot${process.env.API_KEY}/sendMessage`, { chat_id: message.chat.id, text: reply })
            .then((res) => {
            console.log('Message posted');
        })
            .catch((error) => {
            console.log(error);
        });
    }
}
exports.MessageService = MessageService;
//# sourceMappingURL=message.js.map