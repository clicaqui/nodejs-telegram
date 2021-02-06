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
  res.send(`
    <html>
      <head>
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
        <section>
          <h2>My Course Goal</h2>
          <h3>${userGoal}</h3>
        </section>
        <form action="/" method="POST">
          <div class="form-control">
            <label>Course Goal</label>
            <input type="text" name="goal">
          </div>
          <button>Set Course Goal</button>
        </form>
      </body>
    </html>
  `);
});

app.post('/', (req, res) => {
  const enteredGoal = req.body.goal;
  //console.log(enteredGoal);
  userGoal = enteredGoal;
  //res.redirect('/');
  res.redirect(url + API_KEY + `/sendMessage?chat_id=1067356804&text=${userGoal}`);
});

let port = process.env.PORT || 3000;
app.listen(port);
