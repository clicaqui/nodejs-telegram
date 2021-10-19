import axios from 'axios';
import { PassageService } from './passage';

jest.mock('axios');

describe('Fetch from API return obj', () => {
  it('cliente ', () => {
    const retorno = {
      data:
        'In the beginning was the Word, and the Word was with God, and the Word was God.',
    };

    axios.get = jest.fn().mockResolvedValue(retorno);
    const passage = 'John1.1';
    const passageService = new PassageService(axios);
    const response = passageService.findPassage(passage,'');
    expect(response).resolves.toEqual(retorno);
  });

  it('network failed', async () => {
    const errormsg = { message: 'Request failed with status code 403' };
    axios.get = jest.fn().mockRejectedValue(errormsg);
    const passage = 'John1.1';
    const passageService = new PassageService(axios);
    await expect(passageService.findPassage(passage,'')).rejects.toThrow('Request failed with status code 403');
  });
});