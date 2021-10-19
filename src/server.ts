import { ServerSetup } from './app';

(async(): Promise<void> => {
    const server = new ServerSetup(3000);
    await server.init();
    server.start();
})();
