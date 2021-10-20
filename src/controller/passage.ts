import { Controller, Get, Post } from '@overnightjs/core';
import express from 'express';
import axios from 'axios';
import { PassageService } from '../service/passage';
import { MessageService } from '@src/service/message';
import { OldBooks } from '../util/oldbooks';
import { NewBooks } from '../util/newbooks';

@Controller('')
export class PassageControler {
  RANDOM_PASSAGES:string[] ;
  constructor(protected passage:string) {
    this.RANDOM_PASSAGES = [
      'Deuteronomy5.33',
      'Ezekiel34.12',
      '1Chronicles29.5',
      '1Corinthians8.9',
      'John1.1',
      'John5.12',
      'John6.35',
      'John9.5',
      'John11.26',
      '1John2.17',
      '1John3.18',
      'Romans5.10',
      'Romans8.32',
      'Isaiah26.4',
      'Isaiah32.2',
      'Isaiah43.25',
      'Isaiah57.18',
      'Acts16.31',
      'Psalm1.6',
      'Psalm7.10',
      'Psalm27.14',
      'Psalm34.7',
      'Psalm48.14',
      'Psalm72.4',
      'Psalm92.12',
      'Luke21.32',
      'Luke22.26',
      'Psalm2.8',
      'Psalm6.9',
      'Psalm23.4',
      'Psalm118.6',
      'Psalm119.67',
      'Deuteronomy31.6',
      'Proverbs1.10',
      'Revelation3.19',
      'James5.8',
      'Matthew6.33',
      'Matthew11.28',
      'Matthew11.29',
      'Matthew24.35',
    ];
  }
  public generateRandomPhrase = (max: number): number => {
    max = Math.ceil(max);
    const min = Math.floor(0);
    const rand = Math.floor(Math.random() * (max - min)) + min;
    return rand;
  };
  @Post(``)
  public async getActionPassage(req: express.Request, res: express.Response): Promise<void> {
    const OLDBOOKS = Object.entries(OldBooks);
    const NEWBOOKS = Object.entries(NewBooks)
    

    let reply = 'Hi, find your passage on the Bible...';
    const { message } = req.body;
    const myEditedMessage = message.text.toLowerCase();
    const service = new MessageService(axios);
    if (
      myEditedMessage.indexOf('/start') === 0 ||
      myEditedMessage.indexOf('/help') === 0
    ) {
      reply = "To start type something like... '/find john 3 26' ";
    } else if (myEditedMessage.indexOf('/oldtestament') === 0) {
      reply = 'The old testament books are ';
      for (const item in OLDBOOKS) {
        reply += OLDBOOKS[item] + ' ';
      }
    } else if (myEditedMessage.indexOf('/newtestament') === 0) {
      reply = 'The new testament books are ';
      for (const item in NEWBOOKS) {
        reply += NEWBOOKS[item] + ' ';
      }
    } else if (myEditedMessage.indexOf('/phrases') === 0) {
      const randomPassage = this.RANDOM_PASSAGES;
      const nuRandom = this.generateRandomPhrase(randomPassage.length);
      this.passage = randomPassage[nuRandom];

      const passageService = new PassageService(axios);
      const response = await passageService.findPassage(this.passage, reply);
      reply = response;
    } else if (myEditedMessage.indexOf('/find') !== -1 || myEditedMessage.indexOf('/encontre') !== -1 ) {
      const msg = myEditedMessage.split(' ');

      let book ;
      
      if (
        msg.length == 4 &&
        !isNaN(msg[2]) &&
        !isNaN(msg[3]) &&
        (OLDBOOKS.map((bk) => bk.toString().toLowerCase()).includes(msg[1]) ||
          NEWBOOKS.map((bk) => bk.toString().toLowerCase()).includes(msg[1]))
      ) {

         book = OLDBOOKS.map((bk) => {
         if(bk[0] == msg[1].charAt(0).toUpperCase() + msg[1].slice(1) ||
          bk[1] == msg[1].charAt(0).toUpperCase() + msg[1].slice(1))
          bk[0];
         });

        //book = msg[1].charAt(0).toUpperCase() + msg[1].slice(1);
        this.passage = book + msg[2] + '.' + msg[3];
      } else if (
        msg.length == 5 &&
        !isNaN(msg[1]) &&
        !isNaN(msg[3]) &&
        !isNaN(msg[4]) &&
        (OLDBOOKS.map((bk) => bk.toString().toLowerCase()).includes(msg[2]) ||
          NEWBOOKS.map((bk) => bk.toString().toLowerCase()).includes(msg[2]))
      ) {
        book = OLDBOOKS.map((bk) => {
          if(bk[0] == msg[2].charAt(0).toUpperCase() + msg[2].slice(1) ||
           bk[1] == msg[2].charAt(0).toUpperCase() + msg[2].slice(1))
           bk[0];
          });
        this.passage = msg[1] + book + msg[3] + '.' + msg[4];
      }
      if (book) {
        const passageService = new PassageService(axios);
        const response = await passageService.findPassage(this.passage, reply);
        reply = response ;
      } else {
        reply = 'Book informed not exist!';
      }
    }
    //await service.send(message, reply);
    //res.end();
    res.json(reply);
  }
}
