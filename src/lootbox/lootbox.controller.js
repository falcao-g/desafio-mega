const { validate: uuidValidate, version: uuidVersion } = require('uuid');
const { database } = require('../database/knex');

function validateUuidV4(uuid) {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

function listLootboxes(_req, res) {
  database.lootBox.listLootboxes()
    .then((listOfLootboxes) => {
      res.status(200).send(listOfLootboxes);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Internal Server Error :(',
        error: err,
      });
    });
}

async function buyLootboxes(req, res) {
  try {
    const playerId = req.player.uuid;
    const player = await database.player.findOne(playerId);

    const lootBoxId = req.params.lootboxId;
    if (!validateUuidV4(lootBoxId)) {
      return res.status(400).send({
        message: 'This lootbox id is wrong >:(',
      });
    }

    const lootBox = await database.lootBox.findOneLootbox(lootBoxId);
    if (!lootBox) {
      return res.status(400).send({
        message: 'This lootbox does not exist :(',
      });
    }

    if (player.balance < lootBox.price) {
      console.log('entrou no if');
      return res.status(400).send({
        message: 'You dont have enough money :(',
      });
    }

    await database.lootBox.buyLootbox(req.player.uuid, lootBox);

    return res.status(200).send({
      message: `${lootBox.type} Lootbox bought successfully !`,
    });
  } catch (err) {
    return res.status(400).send({
      message: `Error while buying lootboxes${err.message}`,
    });
  }
}

// Create another function dealing with the randomness of each lootboxes

module.exports = {
  listLootboxes,
  buyLootboxes,
};
