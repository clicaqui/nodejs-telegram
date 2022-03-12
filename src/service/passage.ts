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

    public async findPassage(book:string, mensagem:string) : Promise<String>{

        try {
            const response = await this.request
            .get(
              `https://api.biblia.com/v1/bible/content/KJV.txt.txt?passage=${book}&key=${process.env.BOOK_KEY}`
            );
            if (response.status !== 200){
              throw new Error(`Passage not found `);
            } else {
              return response.data + " " + book.replace('.',':');
            }
            
        } catch (error:any) {
            return `Passage not found `;
        }
    }
}