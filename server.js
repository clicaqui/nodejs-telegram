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
       return res.end("ok");
    }).catch(error =>{
        console.log(error);
        return;
    });
}
app.post('/start_bot', (req, res) => {
  const { message } = req.body;
  console.log(message.text );

  let reply = "Escolha um comando para continuar (Type: `/` )";
  if(message.text.toLowerCase().indexOf("hi") === 0){
    reply = "Olá você está no Mensagens Biblicas";
  } else if(message.text.toLowerCase().indexOf("/phrases") === 0){
     res.redirect("/phrases");
  }  
      sendMessage(telegram_url, message, reply, res);
 //     return res.end();
    
});

app.post('/phrases', (req, res) => {
  const { message } = req.body;
  let reply = "Você está no Phrases.";

  sendMessage(telegram_url, message, reply, res);
    
});

let port = process.env.PORT || 3000;
app.listen(port, () => console.log("Telegram bot is listening on port "));
