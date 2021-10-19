import axios from 'axios';
import { BookService } from './book';

jest.mock('axios');

describe('Fetch from BOOK return obj', () => {
  it('cliente ', () => {
    const retorno = {
      data:
      ["Genesis","Exodus","Leviticus"],
    };

    axios.get = jest.fn().mockResolvedValue(retorno);
    const book = 'OLDBOOKS';
    const passageService = new BookService(axios);
    const response = passageService.findBook(book);
    //expect(response).resolves.toEqual(retorno);
    expect(axios.get).toHaveBeenCalledWith("http://findholybible-default-rtdb.firebaseio.com/OLDBOOKS.json")
  });

});