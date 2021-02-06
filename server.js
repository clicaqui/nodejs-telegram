const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");

const app = express();

let userGoal = 'Learn Docker!';

const API_KEY = "1638958493:AAEMBww7qvTjpo-6vXIhvS4LRIbARtNn1wU";

const telegram_url = `https://api.telegram.org/bot${API_KEY}/sendMessage`;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

//app.use(express.static('public'));

app.post('/start', (req, res) => {
  const { message } = req.body;
 // console.log(message);
  let reply = "Welcome to telegram weather bot";
  //if(message.text.toLowerCase().indexOf("hi") !== -1){
  //    sendMessage(telegram_url,message,reply,res);
  //}else{
     // reply = "request not understood, please review and try again.";
      sendMessage(telegram_url,message,reply,res);
      return res.end();
  //}
  
});

app.post('/phrases', (req, res) => {
  const { message } = req.body;
 // console.log(message);
  let reply = "Welcome to telegram weather bot";
  if(message.text.toLowerCase().indexOf("hi") !== -1){
    //  sendMessage(telegram_url,message,reply,res);
  //}else{
      reply = "request not understood, please review and try again.";
      sendMessage(telegram_url,message,reply,res);
      return res.end();
  }
  
});

const sendMessage = (url, message, reply, res) => {
    axios.post(url, { chat_id: message.chat.id,
        text: reply
    }).then(response => {
        console.log("Message posted");
        res.end("ok");
    }).catch(error =>{
        console.log(error);
    });
  }

let port = process.env.PORT || 3000;
app.listen(port, () => console.log("Telegram bot is listening on port 3000!"));
