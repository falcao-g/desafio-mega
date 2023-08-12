const jwt = require('jsonwebtoken');
const controller = require('./auth.controller');

const OK = 200;
const CREATED = 201;

async function register(req, res) {
  try {
    const { name, login, password } = req.query;
    const message = await controller.registerPlayer(name, login, password);
    res.status(CREATED).send({ message });
  } catch (err) {
    res.status(err.httpStatus ?? 500).send({ message: err.message });
  }
}

async function access(req, res) {
  try {
    const { login, password } = req.query;
    const player = await controller.getPlayerByLogin(login);
    await controller.checkPassword(password, player.password);
    await jwt.sign(player, process.env.SECRET, (err, token) => {
      if (err) throw err;

      res.cookie('jwt', token, { httpOnly: true });

      res.status(OK).send({ message: 'Login successful' });
    });
  } catch (err) {
    res.status(err.httpStatus ?? 500).send({ message: err.message });
  }
}

module.exports = {
  register,
  access,
};
