const bcrypt = require('bcrypt');
const { database } = require('../database/knex');
const { ValidationError } = require('../error/ValidationError');

async function checkIfPlayerAlreadyExists(login) {
  const player = await database.auth.findOne(login);
  if (player) throw new ValidationError('Player already exists');
}

async function encryptPassword(password) {
  const saltRounds = 10;
  const encryptedPassword = await bcrypt.hash(password, saltRounds);
  return encryptedPassword;
}

async function registerPlayer(name, login, password) {
  if (!name) throw new ValidationError('Name is required');
  if (!login) throw new ValidationError('Login is required');
  if (!password) throw new ValidationError('Password is required');
  await checkIfPlayerAlreadyExists(login);
  const encryptedPassword = await encryptPassword(password);
  const message = await database.auth.registerPlayer(name, login, encryptedPassword);
  return message;
}

async function getPlayerByLogin(login) {
  if (!login) throw new ValidationError('Login is required');
  const player = await database.auth.findOne(login);
  if (!player) throw new ValidationError('Unknown player');
  return player;
}

async function checkPassword(password, encryptedPassword) {
  if (!password) throw new ValidationError('Password is required');
  const isPasswordValid = await bcrypt.compare(password, encryptedPassword);
  if (!isPasswordValid) throw new ValidationError('Invalid password');
  return isPasswordValid;
}

module.exports = {
  checkIfPlayerAlreadyExists,
  registerPlayer,
  getPlayerByLogin,
  checkPassword,
};
