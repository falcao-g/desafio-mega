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
  try {
    res.send({ message: 'Selling the item' });
  } catch (err) {
    console.error('Error while selling the item', err.message);
  }
}

module.exports = {
  getPlayerInventory,
  getItemDetails,
  sellItem,
};
