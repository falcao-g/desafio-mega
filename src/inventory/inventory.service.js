const controller = require('./inventory.controller');

const OK = 200;

async function listAllItemsFromPlayer(req, res) {
  try {
    const player = await controller.getPlayerById(req.body.payload?.playerId);
    const playerItems = await controller.findAllItemsFromPlayer(player.uuid);
    res.status(OK).send(playerItems);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function getItemDetails(req, res) {
  try {
    const player = await controller.getPlayerById(req.params.playerId);
    const item = await controller.getItemById(req.params.itemId, player.uuid);
    res.status(OK).send(item);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function sellItemFromPlayer(req, res) {
  try {
    const player = await controller.getPlayerById(req.body.payload?.playerId);
    const item = await controller.getItemById(req.query.itemId, player.uuid);
    const message = await controller.sellItem(item, player.uuid);
    res.status(OK).send({ message });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

module.exports = {
  listAllItemsFromPlayer,
  getItemDetails,
  sellItemFromPlayer,
};
