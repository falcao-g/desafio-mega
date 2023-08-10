const { validate: uuidValidate, version: uuidVersion } = require('uuid');
const { database } = require('../database/knex');
const { ValidationError } = require('../error/ValidationError');
const { InvalidItemError } = require('../error/InvalidItemError');

function validateUuidV4(uuid) {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

async function getPlayerById(playerId) {
  const isUuidValid = validateUuidV4(playerId);
  if (!isUuidValid) throw new ValidationError('Invalid UUID');
  const player = await database.player.findOne(playerId);
  if (!player) throw new ValidationError('Unknown player');
  return player;
}

function findAllItemsFromPlayer(playerId) {
  return database.inventory.findAllItemsFromPlayer(playerId);
}

async function getItemById(itemUuid, playerUuid) {
  const isUuidValid = validateUuidV4(itemUuid);
  if (!isUuidValid) throw new ValidationError('Invalid UUID');
  const item = await database.inventory.findOne(itemUuid, playerUuid);
  if (!item) throw new ValidationError('Unknown item');
  return item;
}

async function sellItem(item, playerUuid) {
  const isItemOwner = item.owner === playerUuid;
  if (!isItemOwner) throw new InvalidItemError();
  const message = await database.inventory.sellOne(item);
  return message;
}

async function getPlayerId(req) {
  return !req.params.playerId ? req.player.uuid : req.params.playerId;
}

module.exports = {
  getPlayerById,
  getPlayerId,
  findAllItemsFromPlayer,

  getItemById,
  sellItem,
};
