const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
const { response } = require('express');

const telegram_url = `https://api.telegram.org/bot${process.env.API_KEY}/sendMessage`;

const app = express();

app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.json());

//app.use(bodyParser.json({limit: '10mb'}));
//app.use(express.static('public'));
function sendMessage(url, message, reply, res) {
  //console.log(reply);
   axios.post(url, { chat_id: message.chat.id,
        text: reply,
        parse_mode: 'HTML'
    }).then(response => {
        console.log("Message posted");
       return res.end("ok");
    }).catch(error =>{
        console.log(error);
        return;
    }); 
};

app.post('/' + process.env.API_KEY, (req, res) => {
   const { message } =  req.body;
  //console.log(message);

  let reply = "Hi, find your passage on the Bible...";
  let passage;
  let myEditedMessage = message.text;
  if (myEditedMessage == undefined) {
    myEditedMessage = {text: "john 1 1", chat:{id: 1067356804}};
  }
  //let busca = {};
  if(myEditedMessage.toLowerCase().indexOf("help") === 0){
    reply = "To start type: 'Book Charter verso (john 3 26)' ";
    sendMessage(telegram_url, message, reply, res); 
  } else if(myEditedMessage.toLowerCase().indexOf("/phrases") === 0){
    passage = ["Daniel12.3","John1.1"];
    let rnd = generateRandomPhrase(passage.length, null);
    var busca  = getHolyPassage(passage[rnd], reply);  
    busca.then(resp => {
      //console.log(resp.toString().replace('/[.*+\-?^${}()|[\]\\]/g', '\\$&'));
      reply = resp.toString().replace('\\n\\t','');
       sendMessage(telegram_url, message, reply, res); 
    });

  } else if (myEditedMessage.toLowerCase().indexOf("") !== -1){  
    const msg = myEditedMessage.toLowerCase().split(" ");
    console.log(msg.length);
      if (msg.length = 3) {
        const book = msg[0].charAt(0).toUpperCase() + msg[0].slice(1);
        passage = book + msg[1] + "." + msg[2];
        var busca =  getHolyPassage(passage, reply);  
        busca.then(resp => {
          reply = resp.toString().replace('\\n\\t','');
          sendMessage(telegram_url, message, reply, res); 
       });
      }
  } 
 // setTimeout(() => {
  //   sendMessage(telegram_url, message, reply, res); 
  //}, 4000 );
 //     return res.end();
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
    await axios.get(`https://api.biblia.com/v1/bible/content/LEB.html?passage=${passage}&key=${process.env.BOOK_KEY}`).then(function (retorno) { 
         if (!retorno.status==200) {
           reply = `Passage not found `;
         }else {
           reply = retorno.data + " <br/><p>" + passage + "</p>";
         }
    });
  } catch (err) {
    console.error(err);
  }
  return reply;
}

