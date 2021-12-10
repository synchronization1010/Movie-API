const express = require('express');
const app = express();

app.get('/movies', (req, res) => {
    res.json(movies);
});

let movies = [
    {
      title: 'Home Alone',
      genre: 'Comedy',
      releaseYear: 1990
    },
    {
      title: 'The Fifth Element',
      genre: 'Sci-Fi',
      releasedYear: 1997
    },
    {
      title: 'The Mask of Zoro',
      genre:'Action',
      releasedYear: 1998
    },
    {
      title: 'The Truman Show',
      genre:'Drama',
      releasedYear: 1998
    },
    {
      title: 'Matrix',
      genre: 'Action',
      releasedYear: 1990
    },
    {
      title: 'Edward Scissor Hands',
      genre: 'Drama',
      releasedYear: 1990
    },
    {
      title: 'Liar Liar',
      genre: 'Comedy',
      releasedYear: 1997
    },
    {
      title: 'The Green Mile',
      genre: 'Drama',
      releasedYear: 1999
    },
    {
      title: 'Armageddon',
      genre: 'Action',
      releasedYear: 1998
    },
    {
      title: 'Big Daddy',
      genre: 'Comedy',
      releasedYear: 1999
    }
  ];