const express = require('express');
const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');

const usersService = require('./users.js');
const apiServices = require('./api-services.js');

app.use(cors());
app.use(bodyParser.json());
apiServices.appendApiServicesEndpoints(app);
usersService.appendUserEndpoints(app);

app.get('/', function(req, res) {
  res.send(app._router.stack);
});

module.exports = app;
