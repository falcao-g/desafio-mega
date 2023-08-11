const { TradeStatus } = require('../database/type/tradestatus');
const controller = require('./trade.controller');

const OK = 200;
const CREATED = 201;

async function sendTradeOffer(req, res) {
  try {
    const { player } = req;
    const tradeOffer = controller.extractTradeOfferFromBody(player.uuid, req.body);
    controller.validateItemsUuid(tradeOffer);
    await controller.validatePlayersOwnsRespectiveItems(tradeOffer);
    await controller.validateAllItemsAreAvailableForTrade(tradeOffer);
    await controller.placeTradeOffer(tradeOffer);
    res.status(CREATED).send(tradeOffer);
  } catch (err) {
    res.status(err.httpStatus ?? 500).send({ message: err.message });
  }
}

async function acceptTradeOffer(req, res) {
  try {
    const { player } = req;
    const trade = await controller.getTradeById(req.params.tradeId);
    await controller.acceptTradeOffer(trade, player.uuid);
    res.status(OK).send({ ...trade, status: TradeStatus.ACCEPTED });
  } catch (err) {
    res.status(err.httpStatus ?? 500).send({ message: err.message });
  }
}

async function declineTradeOffer(req, res) {
  try {
    const { player } = req;
    const trade = await controller.getTradeById(req.params.tradeId);
    await controller.declineTradeOffer(trade, player.uuid);
    res.status(OK).send({ ...trade, status: TradeStatus.RECUSED });
  } catch (err) {
    res.status(err.httpStatus ?? 500).send({ message: err.message });
  }
}

async function listAllTradeOffersFromPlayer(req, res) {
  try {
    const { player } = req;
    const playerTrades = await controller.findAllTradesFromPlayer(player.uuid);
    res.status(OK).send(playerTrades);
  } catch (err) {
    res.status(err.httpStatus ?? 500).send({ message: err.message });
  }
}

async function cancelTradeOffer(req, res) {
  try {
    const { player } = req;
    const trade = await controller.getTradeById(req.params.tradeId);
    await controller.cancelTradeOffer(trade, player.uuid);
    res.status(OK).send({ ...trade, status: TradeStatus.CANCELED });
  } catch (err) {
    res.status(err.httpStatus ?? 500).send({ message: err.message });
  }
}

module.exports = {
  sendTradeOffer,
  acceptTradeOffer,
  declineTradeOffer,
  listAllTradeOffersFromPlayer,
  cancelTradeOffer,
};
