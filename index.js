const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Models = require('./models.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('common'));
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

const movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/movies', { useNewUrlParser: true, useUnifiedTopology: true });

//All Movies
app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
  movies.find()
  .then((movies)=>{
      res.status(201).json(movies);
  })
  .catch((err)=>{
      console.error(err);
      res.status(500).send('Error' + err);
  });
});

app.get('/', (req, res) =>{
    res.send('You like movies from the 90\'s, we like movies from the 90\'s!');
});

app.get('/documentation', (req, res) => {
    res.sendFile ('public/documentation.html', {root: __dirname }); //respond through express.static
});

//Movie by title
app.get('/movies/:title', passport.authenticate('jwt', {session: false}), (req, res) => {
  movies.findOne({Title: req.params.title})
  .then((movie)=>{
      res.json(movie);
  })
  .catch((err)=>{
      console.error(err);
      res.status(500).send('Error' + err);
  });
 });

//Genre by name
app.get('/genres/:genre', passport.authenticate('jwt', {session: false}), (req, res) => {
  movies.findOne({'Genre.Name': req.params.genre})
  .then((movie)=>{
      res.json(movie.Genre)
  })
  .catch((err)=>{
      console.error(err);
      res.status(500).send('Error' + err);
  });
});

//Director by name
app.get('/directors/:directorName', passport.authenticate('jwt', {session: false}), (req, res) => {
  movies.findOne({'Director.Name': req.params.directorName})
  .then((movie)=>{
      res.json(movie.Director);
  })
  .catch((err)=>{
      console.error(err);
      res.status(500).send('Error' + err);
  });
})

//Add a user
app.post('/users', passport.authenticate('jwt', {session: false}), (req, res) => {
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

// Get all users
app.get('/users', passport.authenticate('jwt', {session: false}), (req, res) => {
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
app.get('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//Add fav
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//Delete fav
app.delete("/users/:username/FavoriteMovies/:movieID" , passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.username },
    {
      $pull: { FavoriteMovies: req.params.movieID },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});