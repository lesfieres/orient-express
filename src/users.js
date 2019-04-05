const fs = require('fs');
const crypto = require('crypto');

let users = {};
const initialize = function() {
  try {
    const usersFile = fs.readFileSync('users.json');
    users = JSON.parse(usersFile);
  } catch (e) {
    console.error(e);
  }
};

const verifyLoggedUser = (req, res) => {
  let token = req.headers['authorization'];
  if (!token) {
    res.status(401).send({
      error: 'Not authenticated',
    });
    return false;
  }

  token = token.replace('Bearer ', '');
  const validToken = Object.values(users).find(user => user.token == token);
  if (validToken) {
    return validToken;
  } else {
    res.status(401).send({
      error: 'Invalid token',
    });
    return false;
  }
};

const encrypt = data =>
  crypto
    .createHash('md5')
    .update(data)
    .digest('hex');

initialize();

module.exports = {
  initialize,
  users,
  verifyLoggedUser,
  appendUserEndpoints: function(app) {
    app.post('/register', function(req, res) {
      const username = req.body.username;
      let password = req.body.password;

      if (users[username]) {
        res.status(409).send({ error: 'User already exists' });
        return;
      }

      password = encrypt(password);
      users[username] = {
        username,
        password,
      };

      const cleanUsers = Object.keys(users).reduce((obj, username) => {
        obj[username] = {
          username,
          password: users[username].password,
        };
        return obj;
      }, {});
      fs.writeFile('users.json', JSON.stringify(cleanUsers), function() {
        res.status(200).send({ result: 'OK' });
      });
    });

    app.post('/login', function(req, res) {
      const username = req.body.username;
      let password = req.body.password;

      if (!users[username]) {
        res.status(404).send({ error: 'User does not exists' });
        return;
      }

      password = encrypt(password);

      if (users[username].password == password) {
        if (users[username].token) {
          res.status(200).send({ token: users[username].token });
        } else {
          crypto.randomBytes(48, function(err, buffer) {
            let token = buffer.toString('hex');
            users[username].token = token;
            res.status(200).send({ token });
          });
        }
      } else {
        res.status(401).send({ error: 'Password did not match' });
      }
    });

    app.get('/logout', function(req, res) {
      const user = verifyLoggedUser(req, res);
      if (user) {
        user.token = null;
        res.status(200).send({ result: 'Logged out' });
      }
    });

    app.get('/users', function(req, res) {
      if (verifyLoggedUser(req, res)) {
        res.status(200).send(users);
      }
    });
  },
};
