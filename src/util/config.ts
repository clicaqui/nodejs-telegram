import * as dotenv from "dotenv";

dotenv.config();
let path;
switch (process.env.NODE_ENV) {
  case "test":
    path = `${__dirname}/../../env/.env.test`;
    break;
  case "production":
    path = `${__dirname}/../../env/.env.production`;
    break;
  default:
    path = `${__dirname}/../../env/.env.development`;
}
dotenv.config({ path: path });

export const APP_KEY = process.env.APP_KEY;
export const BOOK_KEY = process.env.BOOK_KEY;