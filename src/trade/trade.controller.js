const { validate: uuidValidate, version: uuidVersion } = require('uuid');
const { database } = require('../database/knex');
const { TradeStatus } = require('../database/type/tradestatus');
const { ValidationError } = require('../error/ValidationError');
const { InvalidActionError } = require('../error/InvalidActionError');

const HTTP_FORBIDDEN = 403;

function validateUuidV4(uuid) {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

// Verify if all required data was sent by the user
function extractTradeOfferFromBody(body) {
  // Proposer ID should be get from JWT Payload
  const proposer = body.payload.playerId;
  const {
    acceptor,
    offeredItems,
    requestedItems,
  } = body;

  // Verify if any of the required data is undefined
  const isAnyFieldUndefined = !proposer || !acceptor || !offeredItems || !requestedItems;
  if (isAnyFieldUndefined) throw new ValidationError('The fields acceptor, offeredItems and requestedItems are required');

  // Verify if offeredItems and requestedItems are arrays
  const isItemFieldsArray = Array.isArray(offeredItems) && Array.isArray(requestedItems);
  if (!isItemFieldsArray) throw new ValidationError('offeredItems and requestedItems must be an array of items uuid');

  return {
    proposer, acceptor, offeredItems, requestedItems,
  };
}

function validateItemsUuid(tradeOffer) {
  const allTradingItems = [...tradeOffer.offeredItems, ...tradeOffer.requestedItems];
  const invalidUuids = allTradingItems.reduce((prevInvalidUuids, itemUuid) => {
    const isValidUuidV4 = validateUuidV4(itemUuid);
    if (!isValidUuidV4) prevInvalidUuids.push(itemUuid);
    return prevInvalidUuids;
  }, []);
  if (invalidUuids.length > 0) {
    const errorMessage = 'There are invalid UUIDs:';
    const SP = ' ';
    invalidUuids.forEach((invalidUuid) => errorMessage.concat(`${SP}${invalidUuid}`));
    throw new ValidationError(errorMessage);
  }
}

// Validate if each player owns the specified items
async function validatePlayersOwnsRespectiveItems(tradeOffer) {
  const {
    proposer, acceptor, offeredItems, requestedItems,
  } = tradeOffer;
  const proposerOwnedItems = await database.trade.getItemsFromPlayer(proposer, offeredItems);
  const isProposerOwnerOfOfferedItems = offeredItems.length === proposerOwnedItems.length;
  if (!isProposerOwnerOfOfferedItems) throw new ValidationError('You cannot offer items that you don\'t own');

  const acceptorOwnedItems = await database.trade.getItemsFromPlayer(acceptor, requestedItems);
  const isAcceptorOwnerOfRequestedItems = requestedItems.length === acceptorOwnedItems.length;
  if (!isAcceptorOwnerOfRequestedItems) throw new ValidationError('You cannot request items that the acceptor doesn\'t own');
}

async function validateAllItemsAreAvailableForTrade(tradeOffer) {
  // Verify if every item is available for new trades
  const allTradingItems = [...tradeOffer.offeredItems, ...tradeOffer.requestedItems];
  const unavailableItems = await database.trade.getUntradeableItems(allTradingItems);
  if (unavailableItems.length > 0) {
    const errorMessage = 'There are items unavailable for trade:';
    const SP = ' ';
    unavailableItems.forEach((invalidUuid) => errorMessage.concat(`${SP}${invalidUuid}`));
    throw new ValidationError(errorMessage);
  }
}

async function placeTradeOffer(tradeOffer) {
  const {
    proposer, acceptor, offeredItems, requestedItems,
  } = tradeOffer;
  await database.trade.createTrade(proposer, acceptor, offeredItems, requestedItems);
}

function acceptOrDeclineTradeOffer(req, res) {
  const { playerId } = req.body.payload;
  const { tradeId, action } = req.body;

  if (!playerId) {
    // Shouldn't occur with JWT authentication
    return res.status(400).send({ message: 'playerId unspecified' });
  }

  if (!tradeId) {
    return res.status(400).send({ message: 'tradeId unspecified' });
  }

  if (!action) {
    return res.status(400).send({ message: 'action unspecified ( ACCEPT or RECUSE )' });
  }

  return database.trade.findOne(tradeId)
    .then((trade) => {
      const playerDidntProposedTheTrade = trade.acceptor !== playerId;
      if (playerDidntProposedTheTrade) {
        return res.status(403).send({
          message: 'You can\'t cancel a trade offer that you aren\'t the acceptor',
        });
      }
      if (trade.status !== TradeStatus.PENDING) {
        let message = 'Can\'t accept or recuse trade offer';
        if (trade.status === TradeStatus.ACCEPTED) message = 'Trade already accepted';
        else if (trade.status === TradeStatus.RECUSED) message = 'Trade already recused';
        return res.status(400).send({
          message,
          status: trade.status,
        });
      }

      if (action === 'ACCEPT') {
        return database.trade.acceptTrade(trade.uuid).then(() => {
          res.status(200).send({
            uuid: tradeId,
            status: TradeStatus.ACCEPTED,
          });
        });
      }
      if (action === 'RECUSE') {
        return database.trade.setStatus(trade.uuid, TradeStatus.RECUSED).then(() => {
          res.status(200).send({
            uuid: tradeId,
            status: TradeStatus.RECUSED,
          });
        });
      }
      return res.status(400).send({
        message: `Invalid action: ${action} ( use ACCEPT or RECUSE )`,
      });
    })
    .catch((err) => res.status(500).send({
      message: 'Internal Server Error :(',
      error: err,
    }));
}

async function getPlayerById(playerId) {
  const isUuidValid = validateUuidV4(playerId);
  if (!isUuidValid) throw new ValidationError('Invalid UUID');
  const player = await database.player.findOne(playerId);
  if (!player) throw new ValidationError('Unknown player');
  return player;
}

function findAllTradesFromPlayer(playerId) {
  return database.trade.findAllTradesFromPlayer(playerId);
}

async function getTradeById(tradeUuid) {
  const isUuidValid = validateUuidV4(tradeUuid);
  if (!isUuidValid) throw new ValidationError('Invalid UUID');
  const trade = await database.trade.findOne(tradeUuid);
  if (!trade) throw new ValidationError('Unknown trade');
  return trade;
}

function cancelTradeOffer(tradeOffer, playerUuid) {
  const playerDidntProposedTheTrade = tradeOffer.proposer !== playerUuid;
  if (playerDidntProposedTheTrade) throw new InvalidActionError(tradeOffer.status, 'You can\'t cancel a trade offer that you didn\'t proposed', HTTP_FORBIDDEN);

  switch (tradeOffer.status) {
    case TradeStatus.PENDING:
      return database.trade.setStatus(tradeOffer.uuid, TradeStatus.CANCELED);
    case TradeStatus.CANCELED:
      throw new InvalidActionError(tradeOffer.status, 'Trade already canceled');
    case TradeStatus.ACCEPTED:
      throw new InvalidActionError(tradeOffer.status, 'The acceptor already accepted the trade');
    case TradeStatus.RECUSED:
      throw new InvalidActionError(tradeOffer.status, 'The acceptor already recused the trade');
    default:
      throw new InvalidActionError(tradeOffer.status);
  }
}

module.exports = {
  extractTradeOfferFromBody,
  validateItemsUuid,
  validatePlayersOwnsRespectiveItems,
  validateAllItemsAreAvailableForTrade,
  placeTradeOffer,

  getPlayerById,
  findAllTradesFromPlayer,

  getTradeById,
  cancelTradeOffer,

  acceptOrDeclineTradeOffer,
};
