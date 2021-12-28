const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Models = require('./models.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('common'));



const movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/movies', { useNewUrlParser: true, useUnifiedTopology: true });

let oldmovies = [
    {
      title: 'Home Alone',
      genre: 'Comedy',
    year: 1990
    },
    {
      title: 'The Fifth Element',
      genre: 'Sci-Fi',
      year: 1997
    },
    {
      title: 'The Mask of Zoro',
      genre:'Action',
      year: 1998
    },
    {
      title: 'The Truman Show',
      genre:'Drama',
      year: 1998
    },
    {
      title: 'Matrix',
      genre: 'Action',
      year: 1990
    },
    {
      title: 'Edward Scissor Hands',
      genre: 'Drama',
      year: 1990
    },
    {
      title: 'Liar Liar',
      genre: 'Comedy',
      year: 1997
    },
    {
      title: 'The Green Mile',
      genre: 'Drama',
      year: 1999
    },
    {
      title: 'Armageddon',
      genre: 'Action',
      year: 1998
    },
    {
      title: 'Big Daddy',
      genre: 'Comedy',
      year: 1999
    }   
];

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/', (req, res) =>{
    res.send('You like movies from the 90\'s, we like movies from the 90\'s!');
});

app.get('/documentation', (req, res) => {
    res.sendFile ('public/documentation.html', {root: __dirname }); //respond through express.static
});

app.get('/movies/:title', (req, res) => {
  res.send('Here is your requested movie.');
});

app.get('/genres/:genre', (req, res) => {
  res.send('Here is your requested movie by genre.');
});

app.get('/directors/:name', (req, res) => {
  res.send('Here is your requested movie by director.');
});

app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.put('/users/:username', (req, res) => {
  res.send('Your username has been updated.');
});

app.post('/favorites/:addMovie', (req, res) => {
  res.send('Movie has been added to your favorites list.');
});

app.delete('/favorites/:removeMovie', (req, res) => {
  res.send('Movie has been removed from your favorites list.');
});

app.delete('/users/:removeUser', (req, res) => {
  res.send('Your account has been removed.');
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});