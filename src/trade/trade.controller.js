const { database } = require('../database/knex');

async function sendTradeOffer(req, res) {
  const proposer = req.body.payload.playerId;
  const {
    acceptor,
    offeredItems,
    requestedItems,
  } = req.body;

  // Verify if any of the required data is undefined
  const isAnyFieldUndefined = !proposer || !acceptor || !offeredItems || !requestedItems;
  if (isAnyFieldUndefined) {
    return res.status(400).send({
      message: 'The fields acceptor, offeredItems and requestedItems are required',
    });
  }

  // Verify if offeredItems and requestedItems are arrays
  const tradeItemsAreArray = Array.isArray(offeredItems) && Array.isArray(requestedItems);
  if (!tradeItemsAreArray) {
    return res.status(400).send({
      message: 'offeredItems and requestedItems must be an array of items uuid',
    });
  }

  // Validate if each player owns the specified items
  try {
    const proposerOwnedItems = await database.trade.getItemsFromPlayer(proposer, offeredItems);
    const proposerOwnsAllTheOfferedItems = offeredItems.length === proposerOwnedItems.length;
    if (!proposerOwnsAllTheOfferedItems) {
      return res.status(400).send({
        message: 'You cannot offer items that you don\'t own',
      });
    }

    const acceptorOwnedItems = await database.trade.getItemsFromPlayer(acceptor, requestedItems);
    const acceptorOwnsAllTheRequestedItems = requestedItems.length === acceptorOwnedItems.length;
    if (!acceptorOwnsAllTheRequestedItems) {
      return res.status(400).send({
        message: 'You cannot request items that the acceptor doesn\'t own',
      });
    }
  } catch (err) {
    return res.status(400).send({
      message: 'Check and verify the data sent',
      error: err,
    });
  }

  // Verify if every item is available for new trades
  try {
    const allTradingItems = [...offeredItems, ...requestedItems];
    const unavailableItems = await database.trade.getUntradeableItems(allTradingItems);
    if (unavailableItems.length > 0) {
      return res.status(409).send({
        message: 'There are items on pending trades',
        items: unavailableItems,
      });
    }
  } catch (err) {
    return res.status(500).send({
      message: 'Internal Server Error :(',
      error: err,
    });
  }

  try {
    await database.trade.createTrade(proposer, acceptor, offeredItems, requestedItems);
    return res.status(201).end();
  } catch (err) {
    return res.status(500).send({
      message: 'Internal Server Error :(',
      error: err,
    });
  }
}

function acceptOrDeclineTradeOffer(req, res) {
  try {
    res.send({ message: 'Accepting or declining trade offer' });
  } catch (err) {
    console.error(
      'Error while accepting or declining trade offer',
      err.message,
    );
  }
}

function listAllTradeOffers(req, res) {
  const { playerId } = req.body.payload;
  if (!playerId) {
    // Shouldn't occur with JWT authentication
    res.status(400).send({ message: 'playerId unspecified' });
    return;
  }

  database.trade.findAllTradesFromPlayer(playerId)
    .then((allPlayerTrades) => {
      res.status(200).send(allPlayerTrades);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error :(',
        error: err,
      });
    });
}

function cancelTradeOffer(req, res) {
  try {
    res.send({ message: 'Canceling trade offer' });
  } catch (err) {
    console.error('Error while canceling trade offer', err.message);
  }
}

module.exports = {
  sendTradeOffer,
  acceptOrDeclineTradeOffer,
  listAllTradeOffers,
  cancelTradeOffer,
};
