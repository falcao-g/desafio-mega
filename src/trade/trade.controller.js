const { database } = require('../database/knex');

function sendTradeOffer(req, res) {
  try {
    res.send({ message: 'Sending a trade offer' });
  } catch (err) {
    console.error('Error while sending trade offer', err.message);
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
