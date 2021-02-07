const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");

const telegram_url = `https://api.telegram.org/bot${process.env.API_KEY}/sendMessage`;

const app = express();

//app.use(bodyParser.urlencoded({extended: false})); 
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, PATCH, PUT"
  );
  next();
});

//app.use(bodyParser.json({limit: '10mb'}));
//app.use(express.static('public'));
function sendMessage(url, message, reply, res) {
  //console.log(reply);
   axios.post(url, { chat_id: message.chat.id,
        text: reply
  }).then(response => {
        console.log("Message posted");
      // return res.end("ok");
    }).catch(error =>{
        console.log(error);
      //  return res.end();
    }); 
};

app.post('/' + process.env.API_KEY, (req, res) => {
   const { message } = req.body;
   
   let reply = "Hi, find your passage on the Bible...";
   let passage;
   let myEditedMessage = message.text;
   console.log(myEditedMessage);

  if(myEditedMessage.toLowerCase().indexOf("/start") === 0 || 
    myEditedMessage.toLowerCase().indexOf("help") === 0 ){
    reply = "To start type: 'Book Charter verso (john 3 26)' ";
    sendMessage(telegram_url, message, reply, res); 
  } else if(myEditedMessage.toLowerCase().indexOf("/phrases") === 0){
    passage = ["Daniel12.3","John1.1"];
    let rnd = generateRandomPhrase(passage.length, null);
    var busca  = getHolyPassage(passage[rnd], reply);  
    busca.then(resp => {
      reply = resp;
      //reply = reply.replace(/\\\\n\\\\t/g, '');
      //reply = reply.replace(/\<br/g, '');
      //reply = reply.replace(/\<p/g, '<pre').replace(/p\>/g, 'pre>');
       sendMessage(telegram_url, message, reply, res); 
    });

  } else if (myEditedMessage.toLowerCase().indexOf("") !== -1){  
    const msg = myEditedMessage.toLowerCase().split(" ");
    //console.log(msg.length);
    let book;
      if (msg.length == 3) {
         book = msg[0].charAt(0).toUpperCase() + msg[0].slice(1);
        passage = book + msg[1] + "." + msg[2];
       } else if (msg.length > 3){
         book = msg[1].charAt(0).toUpperCase() + msg[0].slice(1);
        passage = msg[0] + book + msg[2] + "." + msg[3];
      }  
      if (book) {

        var busca =  getHolyPassage(passage, reply);  
        busca.then(resp => {
          reply = resp;
          //reply = reply.replace(/\\\\n\\\\t/g, '');
          //reply = reply.replace(/\<br/g, '');
          //reply = reply.replace(/\<p/g, '<pre').replace(/p\>/g, 'pre>');

          sendMessage(telegram_url, message, reply, res); 
        });
      }
      
    } 
    return res.end();
});

let port = process.env.PORT || 3000;
app.listen(port, () => console.log("Telegram bot is listening on port 3000"));
const generateRandomPhrase = (max, exclude) => {
  max = Math.ceil(max);
  min = Math.floor(0);
  const rand = Math.floor(Math.random() * (max - min)) + min;
  if (rand === exclude){
      return generateGuessNumber(min, max, exclude);
  } else {
      return rand;
  }
}

const getHolyPassage = async (passage,reply) => {
 try {
    await axios.get(`https://api.biblia.com/v1/bible/content/LEB.txt.txt?passage=${passage}&key=${process.env.BOOK_KEY}`).then(function (retorno) { 
         if (!retorno.status==200) {
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

