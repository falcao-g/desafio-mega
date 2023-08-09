const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../error/AuthenticationError');

function authenticateToken(req, res, next) {
  if (req.headers.cookie == null) {
    res.send(new AuthenticationError());
  }

  const authHeader = req.headers.cookie;
  const token = authHeader && authHeader.split('=')[1];

  if (token == null) {
    res.send(new AuthenticationError());
  }

  return jwt.verify(token, process.env.SECRET, (err, player) => {
    if (err) {
      res.send(new AuthenticationError());
    }

    req.player = player;
    return next();
  });
}

module.exports = authenticateToken;
