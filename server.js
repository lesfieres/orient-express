const express = require('express');
const app = express();
const ApiServices = require('api-services');
const env = require('dotenv');

let config = env.config().parsed;
const goodreadsService = new ApiServices.GoodreadsService(
  config.GOODREADS_KEY,
  config.GOODREADS_SECRET
);

app.get('/search', function(req, res) {
  const title = req.query.title;
  const fromPage = req.query.from;
  const toPage = req.query.to;
  console.log(title, fromPage, toPage)
  goodreadsService.search(title, fromPage, toPage).then((books) => {
    console.log(books.length);
    res.send(books);
  });
});

const server = app.listen(8081, function() {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
