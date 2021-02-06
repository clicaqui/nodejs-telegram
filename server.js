const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");

const app = express();

const telegram_url = `https://api.telegram.org/bot${process.env.API_KEY}/sendMessage`;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static('public'));
function sendMessage(url, message, reply, res) {
    axios.post(url, { chat_id: message.chat.id,
        text: reply
    }).then(response => {
        console.log("Message posted");
        //res.end("ok");
    }).catch(error =>{
        console.log(error);
    });
}
app.post('/start_bot', (req, res) => {
  const { message } = req.body;
  console.log(message.text.toLowerCase().indexOf("hi") );
  let reply = "Olá bem vindo ao Mensagens Biblicas";
  if(message.text.toLowerCase().indexOf("hi") !== -1){
      sendMessage(telegram_url,message,reply,res);
  }else{
      reply = "Escolha um comando para ir adiante (Type '/').";
      sendMessage(telegram_url,message,reply,res);
      return res.end();
  }  
});

let port = process.env.PORT || 3000;
app.listen(port, () => console.log("Telegram bot is listening on port "));
