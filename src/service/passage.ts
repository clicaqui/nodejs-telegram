import { AxiosStatic } from "axios";

export class ServiceError extends Error{
    constructor(message: string) {
        const internalMessage =
          'Unexpected error when trying to comunicate to PassageBible';
        super(`${internalMessage}:${message}`);
      }
}

export class PassageService {
    constructor(protected request: AxiosStatic) {}

    public async findPassage(book:string, mensagem:string) {
       
        try {
            await this.request
            .get(
              `http://api.biblia.com/v1/bible/content/KJV.txt.txt?passage=${book}&key=${process.env.BOOK_KEY}`
            )
            .then((retorno: any) => {
              if (retorno.status !== 200) {
                mensagem = `Passage not found `;
              } else {
                mensagem = retorno.data + ' ' + book.replace('.',':');
              }
            });
            
        } catch (error) {
            throw new ServiceError(error.message);
        }
        return mensagem;
    }
}