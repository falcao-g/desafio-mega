const { database } = require('../database/knex');

function getPlayerInventory(req, res) {
  database.inventory.findAllItemsFromPlayer(req.params.playerId)
    .then((allPlayerItems) => {
      res.status(200).send(allPlayerItems);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error :(',
        error: err,
      });
    });
}

function getItemDetails(req, res) {
  database.inventory.getItemDetails(req.params.playerId, req.params.itemId)
    .then((itemDetails) => {
      res.status(200).send(itemDetails);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error :(',
        error: err,
      });
    });
}

function sellItem(req, res) {
  const { itemId } = req.query;
  database.inventory.sellItem(itemId)
    .then((message) => {
      res.status(200).send(message);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error :(',
        error: err,
      });
    });
}

module.exports = {
  getPlayerInventory,
  getItemDetails,
  sellItem,
};
