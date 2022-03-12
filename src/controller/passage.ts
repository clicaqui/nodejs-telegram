import { Controller, Post } from '@overnightjs/core';
import express from 'express';
import axios from 'axios';
import { PassageService } from '../service/passage';
import { MessageService } from '@src/service/message';
import { OldBooks } from '../util/oldbooks';
import { NewBooks } from '@src/util/newbooks';
import { RamdonBooks } from '../util/ramdon-books';

@Controller('')
export class PassageControler {
  RANDOM_PASSAGES:string[] ;
  constructor(protected passage:string) {
    this.RANDOM_PASSAGES = RamdonBooks;
  }
  public generateRandomPhrase = (max: number): number => {
    max = Math.ceil(max);
    const min = Math.floor(0);
    const rand = Math.floor(Math.random() * (max - min)) + min;
    return rand;
  };
  @Post(`${process.env.API_KEY}`)
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
      reply = response.toString();
    } else if (myEditedMessage.indexOf('/find') !== -1 || myEditedMessage.indexOf('/encontre') !== -1 ) {
      const msg = myEditedMessage.split(' ');
      let book:any;
      if (
        msg.length == 4 &&
        !isNaN(msg[2]) &&
        !isNaN(msg[3]) 
      ) {
          book = undefined;
          book = OLDBOOKS.find((bk) => {
            return (bk[0] == msg[1].charAt(0).toUpperCase() + msg[1].slice(1) || bk[1] == msg[1].charAt(0).toUpperCase() + msg[1].slice(1))       
          });
          if (!book){
            book = NEWBOOKS.find((bk) => {
              return (bk[0] == msg[1].charAt(0).toUpperCase() + msg[1].slice(1) || bk[1] == msg[1].charAt(0).toUpperCase() + msg[1].slice(1))       
            });
          }
        //book = msg[1].charAt(0).toUpperCase() + msg[1].slice(1);
        this.passage = book[0] + msg[2] + '.' + msg[3];
      } else if (
        msg.length == 5 &&
        !isNaN(msg[1]) &&
        !isNaN(msg[3]) &&
        !isNaN(msg[4]) 
      ) {
        book = undefined;
        book = OLDBOOKS.find((bk) => {
         return (bk[0] == msg[2].charAt(0).toUpperCase() + msg[2].slice(1) || bk[1] == msg[2].charAt(0).toUpperCase() + msg[2].slice(1) ) ;
          });
        if (!book){
          book = NEWBOOKS.find((bk) => {
            return (bk[0] == msg[2].charAt(0).toUpperCase() + msg[2].slice(1) || bk[1] == msg[2].charAt(0).toUpperCase() + msg[2].slice(1) ) ;
             });         
        }  
        this.passage = msg[1] + book[0] + msg[3] + '.' + msg[4];
      }
      if (book) {
        const passageService = new PassageService(axios);
        const response = await passageService.findPassage(this.passage, reply);
        reply = response.toString() ;
      } else {
        reply = 'Book informed not exist!';
      }
    }
    await service.send(message, reply);
    res.end();
    //res.json(reply);
  }
}
