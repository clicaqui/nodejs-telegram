import { AxiosStatic } from "axios";


export class BookService {
    constructor(protected request: AxiosStatic) {}

    public async findBook(book:string) {
       
        //try {
           const retorno = await this.request
            .get(
              `http://findholybible-default-rtdb.firebaseio.com/${book}.json`
            )
            //.then((retorno: any) => {
            //  if (retorno.status !== 200) {
            //     return `Passage not found `;
            //  } 
            //   return retorno.data;
            //});
            return retorno.data;
       // return books;
    }
}