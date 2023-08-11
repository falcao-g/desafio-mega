const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../error/AuthenticationError');

function authenticateToken(req, res, next) {
  try {
    if (req.headers.cookie == null) {
      throw new AuthenticationError();
    }

    const authHeader = req.headers.cookie;
    const token = authHeader && authHeader.split('=')[1];

    if (token == null) {
      throw new AuthenticationError();
    }

    jwt.verify(token, process.env.SECRET, (err, player) => {
      if (err) {
        throw new AuthenticationError();
      }

      req.player = player;
      next();
    });
  } catch (err) {
    res.status(err.httpStatus ?? 500).send({ message: err.message });
  }
}

module.exports = authenticateToken;
