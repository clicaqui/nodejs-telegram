const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");

const telegram_url = `https://api.telegram.org/bot${process.env.API_KEY}/sendMessage`;

const app = express();

app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.json());

//app.use(bodyParser.json({limit: '10mb'}));
//app.use(express.static('public'));
function sendMessage(url, message, reply, res) {
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
  //console.log(Object(req.body));
  const { message } =  req.body;
  console.log(Object.keys(req.body)[1].text);

  let reply = "Hi, find your passage on the Bible...";
  let myEditedMessage = Object.keys(req.body)[1].text;
  if (myEditedMessage == undefined) {
    myEditedMessage = {text: "john 1 1", chat:{id: 1067356804}};
  }

  if(myEditedMessage.toLowerCase().indexOf("hi") === 0){
    reply = "To start type: '/' )";
  } else if(myEditedMessage.toLowerCase().indexOf("/phrases") === 0){
    const msg = myEditedMessage.toLowerCase().split(" ");
    const book = msg[1].charAt(0).toUpperCase() + msg[1].slice(1);
    const passage = book + msg[2] + "." + msg[3];
    
     axios.get(`https://api.biblia.com/v1/bible/content/LEB.html?passage=${passage}&key=${process.env.BOOK_KEY}`).then(result => {
      console.log(result);
      reply = result + " - " + passage; 
    }).catch(err => {
      reply = `Passage not found - ${err}`;
    });  
  } 
  sendMessage(telegram_url, message, reply, res); 
 //     return res.end();
});

let port = process.env.PORT || 3000;
app.listen(port, () => console.log("Telegram bot is listening on port 3000"));
