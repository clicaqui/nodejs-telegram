import { ServerSetup } from '@src/app';
import supertest from 'supertest';

let server: ServerSetup;
beforeAll(async () => {
  server = new ServerSetup();
  server.init();
  global.testRequest = supertest(server.getApp());
});