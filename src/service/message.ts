import { AxiosStatic } from 'axios';

export interface MessageType  {
    text: string,
    chat: {
      id: number
    }
}


export class MessageService {
  constructor(protected request: AxiosStatic) {}
  public async send(message: MessageType, reply: string):Promise<void> {
    await this.request
      .post(
        `https://api.telegram.org/bot${process.env.API_KEY}/sendMessage`,
        { chat_id: message.chat.id, text: reply }
      )
      .then((res) => {
        console.log('Message posted');
      })
      .catch((error) => {
        console.log(error);
    });
  }
  
}
