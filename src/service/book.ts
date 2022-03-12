import { AxiosStatic } from "axios";


export class BookService {
    constructor(protected request: AxiosStatic) {}

    public async findBook(book:string) {
       
        try {
           const retorno = await this.request
            .get(
              `http://findholybible-default-rtdb.firebaseio.com/${book}.json`
            )
            if (retorno.status == 200) {
              return retorno.data;
            } else {
              throw new Error("Passage not found")
            }

        } catch(err:any) {
          return err.message;
        }  

    }
}