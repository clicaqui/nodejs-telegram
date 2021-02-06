const express = require('express');
const bodyParser = require('body-parser');

const app = express();

let userGoal = 'Learn Docker!';

const API_KEY = "1638958493:AAEMBww7qvTjpo-6vXIhvS4LRIbARtNn1wU";

const url = "https://api.telegram.org/bot";

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(express.static('public'));

app.get('/', (req, res) => {

  console.log(`Entrou pelo GET ${req.bodyParser}`);
});

app.post('/', (req, res) => {
  const enteredGoal = req.body.goal;

  console.log(`Entrou pelo POST ${req.bodyParser}`);
  userGoal = enteredGoal;
  //res.redirect('/');
  res.redirect(url + API_KEY + `/sendMessage?chat_id=1067356804&text=${userGoal}`);
});

let port = process.env.PORT || 3000;
app.listen(port);
