"use strict";
describe('Testando as rotas da app', () => {
    it('POST - Invocar o metodo princial', async () => {
        const data = {
            message: {
                chat: { id: 1067356804 },
                text: '/start'
            }
        };
        const { body, status } = await global.testRequest.post(`/${process.env.API_KEY}`).send(data);
        expect(status).toBe(200);
        expect(body).toEqual("To start type something like... '/find john 3 26' ");
    });
    it('POST - Invocar o metodo busca', async () => {
        const data = {
            message: {
                chat: { id: 1067356804 },
                text: '/find john 1 1'
            }
        };
        const { body, status } = await global.testRequest.post(`/${process.env.API_KEY}`).send(data);
        expect(status).toBe(200);
        expect(body).toEqual("In the beginning was the Word, and the Word was with God, and the Word was God. John1:1");
    });
});
//# sourceMappingURL=integration.test.js.map