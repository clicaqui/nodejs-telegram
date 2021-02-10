//const express = require('express');
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { RANDOM_PASSAGES } from './random';


const telegram_url = `https://api.telegram.org/bot${process.env.API_KEY}/sendMessage`;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let passage:string;
//app.use(bodyParser.json({limit: '10mb'}));
//app.use(express.static('public'));
function sendMessage(url:any, message:any, reply:string, res:any) {
   axios.post(url, { chat_id: message.chat.id,
        text: reply
  }).then((response:any) => {
        console.log("Message posted");
      // return res.end("ok");
    }).catch((error:any) =>{
        console.log(error);
    }); 
};

app.post('/' + process.env.API_KEY, (req:any, res:any) => {
   const { message } = req.body;
   let reply = "Hi, find your passage on the Bible...";
   let myEditedMessage = message.text;

  if(myEditedMessage.toLowerCase().indexOf("/start") === 0 || 
    myEditedMessage.toLowerCase().indexOf("/help") === 0 ){
    reply = "To start type something like... '/find john 3 26' ";
    sendMessage(telegram_url, message, reply, res); 
  } else if(myEditedMessage.toLowerCase().indexOf("/oldtestament") === 0){
    reply = "The old testament books are ";
    for(var item in OLDBOOKS){
      //console.log(item);
      reply += OLDBOOKS[item] + " ";
    }
    sendMessage(telegram_url, message, reply, res);  
  } else if(myEditedMessage.toLowerCase().indexOf("/newtestament") === 0){
     reply = "The new testament books are ";
    for(var item in NEWBOOKS){
      reply += NEWBOOKS[item] + " ";
    }
    sendMessage(telegram_url, message, reply, res);  
  } else if(myEditedMessage.toLowerCase().indexOf("/phrases") === 0){
    let passage = RANDOM_PASSAGES;
    let rnd = generateRandomPhrase(passage.length, null);
    var busca  = getHolyPassage(passage[rnd], reply);  
    busca.then(resp => {
      reply = resp;
      //reply = reply.replace(/\\\\n\\\\t/g, '');
      //reply = reply.replace(/\<br/g, '');
      //reply = reply.replace(/\<p/g, '<pre').replace(/p\>/g, 'pre>');
       sendMessage(telegram_url, message, reply, res); 
    });

  } else if (myEditedMessage.toLowerCase().indexOf("/find") !== -1){  
    const msg = myEditedMessage.toLowerCase().split(" ");

    let book;
      if (msg.length == 4 && !isNaN(msg[2]) && !isNaN(msg[3]) && (OLDBOOKS.map(bk => bk.toLowerCase()).includes(msg[1]) ||
         NEWBOOKS.map(bk => bk.toLowerCase()).includes(msg[1]))) {
         book = msg[1].charAt(0).toUpperCase() + msg[1].slice(1);
        passage = book + msg[2] + "." + msg[3];
       } else if (msg.length == 5 && !isNaN(msg[1]) && !isNaN(msg[3]) && !isNaN(msg[4]) && (OLDBOOKS.map(bk => bk.toLowerCase()).includes(msg[2]) ||
           NEWBOOKS.map(bk => bk.toLowerCase()).includes(msg[2]))){
         book = msg[2].charAt(0).toUpperCase() + msg[2].slice(1);
        passage = msg[1] + book + msg[3] + "." + msg[4];
      }  
      if (book) {
        var busca =  getHolyPassage(passage, reply);  
        busca.then(resp => {
          reply = resp;
          sendMessage(telegram_url, message, reply, res); 
        });
      } else {
        reply = "Book informed not exist!";
        sendMessage(telegram_url, message, reply, res); 
      }
    } 
    return res.end();
});

let port = process.env.PORT || 3000;
app.listen(port, () => console.log("Telegram bot is listening on port 3000"));
const generateRandomPhrase = (max: number, exclude: number | null):number => {
  max = Math.ceil(max);
  let min = Math.floor(0);
  const rand = Math.floor(Math.random() * (max - min)) + min;
  if (rand === exclude){
      return generateRandomPhrase(max, exclude);
  } else {
      return rand;
  }
}

const getHolyPassage = async (passage:string,reply:string) => {
 try {
    await axios.get(`https://api.biblia.com/v1/bible/content/KJV.txt.txt?passage=${passage}&key=${process.env.BOOK_KEY}`)
      .then((retorno:any) => { 
         if (retorno.status!==200) {
           reply = `Passage not found `;
         }else {
           reply = retorno.data + " " + passage ;
         }
    });
  } catch (err) {
    console.error(err);
  }
  return reply;
}
const OLDBOOKS = ["Genesis" , "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Samuel", "Kings", "Chronicles", "Nehemiah", "Job", "Psalm", "Proverbs", "Ecclesiastes", "Isaiah", "Jeremiah", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Jonah", "Naum","Micah", "Habakkuk", "Zephaniah", "Haggai", "Malachi"];
const NEWBOOKS = ["Matthew", "Mark", "Luke", "John", "Acts", "Romans", "Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "Thessalonians", "Timothy", "Titus", "Hebrews" , "James", "Peter", "Jude", "Revelation"];
