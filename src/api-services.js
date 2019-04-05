const env = require('dotenv');
const { GoodreadsService, OmbdService } = require('api-services');

let config = env.config().parsed;
const goodreadsService = new GoodreadsService(
  config.GOODREADS_KEY,
  config.GOODREADS_SECRET,
);
const ombdService = new OmbdService(config.OMBD_KEY);

module.exports = {
  appendApiServicesEndpoints: function(app) {
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
  },
};
