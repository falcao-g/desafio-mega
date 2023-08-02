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
  try {
    res.send({ message: 'Getting item details' });
  } catch (err) {
    console.error('Error while seeing player inventory', err.message);
  }
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
