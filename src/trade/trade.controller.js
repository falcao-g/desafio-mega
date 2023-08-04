const { database } = require('../database/knex');
const { TradeStatus } = require('../database/type/tradestatus');

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
  const { playerId } = req.body.payload;
  const { tradeId } = req.params;

  if (!playerId) {
    // Shouldn't occur with JWT authentication
    res.status(400).send({ message: 'playerId unspecified' });
    return;
  }

  database.trade.findOne(tradeId)
    .then((trade) => {
      const playerDidntProposedTheTrade = trade.proposer !== playerId;
      if (playerDidntProposedTheTrade) {
        return res.status(403).send({
          message: 'You can\'t cancel a trade offer that you didn\'t proposed',
        });
      }
      if (trade.status !== TradeStatus.PENDING) {
        let message = 'Can\'t cancel trade offer';
        if (trade.status === TradeStatus.CANCELED) message = 'Trade already canceled';
        return res.status(400).send({
          message,
          status: trade.status,
        });
      }

      return database.trade.setStatus(trade.uuid, TradeStatus.CANCELED).then(() => {
        res.status(200).send({
          uuid: tradeId,
          status: TradeStatus.CANCELED,
        });
      });
    })

    .catch((err) => res.status(500).send({
      message: 'Internal Server Error :(',
      error: err,
    }));
}

module.exports = {
  sendTradeOffer,
  acceptOrDeclineTradeOffer,
  listAllTradeOffers,
  cancelTradeOffer,
};
