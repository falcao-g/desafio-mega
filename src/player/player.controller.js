const { validate: uuidValidate, version: uuidVersion } = require('uuid');
const { database } = require('../database/knex');
const { ValidationError } = require('../error/ValidationError');

function validateUuidV4(uuid) {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

function getPlayerProfile(playerUuid) {
  const isValidUuid = validateUuidV4(playerUuid);
  if (!isValidUuid) throw new ValidationError('Invalid player UUID');
  return database.player.findOne(playerUuid);
}

function getPlayerId(req) {
  return !req.params.playerId ? req.body.payload?.playerId : req.params.playerId;
}

async function getPlayerById(playerId) {
  const isUuidValid = validateUuidV4(playerId);
  if (!isUuidValid) throw new ValidationError('Invalid UUID');
  const player = await database.player.findOne(playerId);
  if (!player) throw new ValidationError('Unknown player');
  return player;
}

function getDepositQuantity(req) {
  const { quantity } = req.body;
  if (!quantity) throw new ValidationError('Missing field: quantity');
  if (!Number.isInteger(quantity)) throw new ValidationError('Quantity isn\'t a integer');
  if (quantity < 0) throw new ValidationError('Quantity must be a positive integer');
  return quantity;
}

function addFundsTo(player, quantity) {
  return database.player.incrementBalanceOfPlayer(player.uuid, quantity);
}

module.exports = {
  getPlayerId,
  getPlayerProfile,

  getPlayerById,
  getDepositQuantity,
  addFundsTo,
};
