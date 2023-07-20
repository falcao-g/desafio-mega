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
  try {
    res.send({ message: 'Listing all trade offers' });
  } catch (err) {
    console.error('Error while listing trade offers', err.message);
  }
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
