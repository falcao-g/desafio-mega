const controller = require('./trade.controller');

const CREATED = 201;

async function sendTradeOffer(req, res) {
  try {
    const tradeOffer = controller.extractTradeOfferFromBody(req.body);
    controller.validateItemsUuid(tradeOffer);
    await controller.validatePlayersOwnsRespectiveItems(tradeOffer);
    await controller.validateAllItemsAreAvailableForTrade(tradeOffer);
    await controller.placeTradeOffer(tradeOffer);
    res
      .status(CREATED)
      .send(tradeOffer);
  } catch (err) {
    res
      .status(err.httpSatus)
      .send({ message: err.message });
  }
}

function acceptTradeOffer(req, res) {
  res.send({ message: 'TODO: Implement' });
}

function declineTradeOffer(req, res) {
  res.send({ message: 'TODO: Implement' });
}

function listAllTradeOffersFromPlayer(req, res) {
  res.send({ message: 'TODO: Implement' });
}

function cancelTradeOffer(req, res) {
  res.send({ message: 'TODO: Implement' });
}

module.exports = {
  sendTradeOffer,
  acceptTradeOffer,
  declineTradeOffer,
  listAllTradeOffersFromPlayer,
  cancelTradeOffer,
};
