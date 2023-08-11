const { validate: uuidValidate, version: uuidVersion } = require('uuid');
const bcrypt = require('bcrypt');
const { database } = require('../database/knex');
const { ValidationError } = require('../error/ValidationError');

function validateUuidV4(uuid) {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

async function getPlayerProfile(playerUuid) {
  const isValidUuid = validateUuidV4(playerUuid);
  if (!isValidUuid) throw new ValidationError('Invalid player UUID');
  return database.player.findOne(playerUuid);
}

async function getPlayerId(req) {
  return !req.params.playerId ? req.player.uuid : req.params.playerId;
}

async function getPlayerById(playerId) {
  const isUuidValid = validateUuidV4(playerId);
  if (!isUuidValid) throw new ValidationError('Invalid UUID');
  const player = await database.player.findOne(playerId);
  if (!player) throw new ValidationError('Unknown player');
  return player;
}

function getDepositQuantity(req) {
  const quantity = Number(req.query.quantity);
  if (!quantity) throw new ValidationError('Missing field: quantity');
  if (!Number.isInteger(quantity)) throw new ValidationError('Quantity isn\'t a integer');
  if (quantity < 0) throw new ValidationError('Quantity must be a positive integer');
  return quantity;
}

async function addFundsTo(player, quantity) {
  await database.player.incrementBalanceOfPlayer(player.uuid, quantity);
  return `Added ${quantity} to balance succesfully`;
}

async function editPlayer(player, name, password, picturePath) {
  const updatedPlayer = { ...player };
  updatedPlayer.name = name;
  if (password) {
    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    updatedPlayer.password = encryptedPassword;
  }
  updatedPlayer.picturePath = picturePath;
  await database.player.update(updatedPlayer);
  return 'Player updated successfully';
}

module.exports = {
  getPlayerId,
  getPlayerProfile,

  getPlayerById,
  getDepositQuantity,
  addFundsTo,

  editPlayer,
};
