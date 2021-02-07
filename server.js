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
  console.log(reply);
   axios.post(url, { chat_id: message.chat.id,
        text: reply
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
 
  if(myEditedMessage.toLowerCase().indexOf("hi") === 0){
    reply = "To start type: '/' )";
  } else if(myEditedMessage.toLowerCase().indexOf("/phrases") === 0){
    passage = ["Daniel12.3","John1.1"];
    let rnd = generateRandomPhrase(passage.length, null);
    reply = getHolyPassage(passage[rnd], reply);  

  } else if (myEditedMessage.toLowerCase().indexOf("") !== -1){  
    const msg = myEditedMessage.toLowerCase().split(" ");
      if (msg.length > 3) {
        const book = msg[1].charAt(0).toUpperCase() + msg[1].slice(1);
        passage = book + msg[2] + "." + msg[3];
        
        reply =  getHolyPassage(passage, reply);  
      }
  } 
  setTimeout(() => {
     sendMessage(telegram_url, message, reply, res); 
  }, 4000 );
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
    const response = await axios.get(`https://api.biblia.com/v1/bible/content/LEB.html?passage=${passage}&key=${process.env.BOOK_KEY}`);
  } catch (err) {
    console.error(err);
  }
  console.log(response);

    if (!response.ok) {
      reply = `Passage not found `;
    }else {
      reply = response.data + " <br/><p>" + passage + "</p>";
    }
    return reply;

}

