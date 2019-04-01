const express = require('express');
const cors = require('cors');
const app = express();
const { GoodreadsService, OmbdService } = require('api-services');
const env = require('dotenv');
const bodyParser = require('body-parser');

const usersService = require('./users.js');

app.use(cors());
app.use(bodyParser.json());
usersService.appendUserEndpoints(app);

let config = env.config().parsed;
const goodreadsService = new GoodreadsService(
  config.GOODREADS_KEY,
  config.GOODREADS_SECRET,
);
const ombdService = new OmbdService(config.OMBD_KEY);

app.get('/search-book', function(req, res) {
  const title = req.query.title;
  const fromPage = req.query.from;
  const toPage = req.query.to;

  goodreadsService.search(title, fromPage, toPage).then(books => {
    res.send(books);
  });
});

app.get('/search-movie', function(req, res) {
  const title = req.query.title;
  const fromPage = req.query.from;
  const toPage = req.query.to;

  ombdService.search(title, fromPage, toPage).then(movies => {
    res.send(movies);
  });
});

app.get('/get-movie', function(req, res) {
  const id = req.query.id;

  ombdService.getMovieInfo(id).then(movie => {
    res.send(movie);
  });
});

const server = app.listen(8081, 'localhost', function() {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
