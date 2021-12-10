const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(morgan('common'));

let movies = [
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

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});