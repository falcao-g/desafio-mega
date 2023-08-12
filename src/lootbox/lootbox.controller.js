const { validate: uuidValidate, version: uuidVersion } = require('uuid');
const { v4 } = require('uuid');
const { database } = require('../database/knex');

function validateUuidV4(uuid) {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

function randomNumberInsideRange(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1) + min,
  );
}

// ('ec9f98c8-e1b6-4276-8ccc-e6dbc6a953bc', 'MATERIAL', 25),
function openMaterialLootbox(playerWhoOpenedId) {
  const newItem = {
    uuid: v4(),
    owner: '',
    type: '',
    value: 0,
    name: '',
  };

  newItem.owner = playerWhoOpenedId;
  newItem.type = 'MATERIAL';

  // Material Lootbox: Stone (1), Wood (2) or Clay (3)
  const randomItemType = randomNumberInsideRange(1, 3);

  if (randomItemType === 1) {
    newItem.value = randomNumberInsideRange(10, 50); // Stone
    newItem.name = 'Stone';
  }

  if (randomItemType === 2) {
    newItem.value = randomNumberInsideRange(15, 35); // Wood
    newItem.name = 'Wood';
  }

  if (randomItemType === 3) {
    newItem.value = randomNumberInsideRange(20, 50); // Clay
    newItem.name = 'Clay';
  }
  return newItem;
}

// ('726333b5-2b01-44da-b310-4c4701637fa9', 'SWORD', 150),
function openSwordLootbox(playerWhoOpenedId) {
  const newItem = {
    uuid: v4(),
    owner: '',
    type: '',
    value: 0,
    name: '',
  };

  newItem.owner = playerWhoOpenedId;
  newItem.type = 'SWORD';

  // Sword Lootbox: Katana (1) or Dagger (2)
  const randomItemType = randomNumberInsideRange(1, 2);

  if (randomItemType === 1) {
    newItem.value = randomNumberInsideRange(100, 350); // Katana
    newItem.name = 'Katana';
  }

  if (randomItemType === 2) {
    newItem.value = randomNumberInsideRange(50, 300); // Dagger
    newItem.name = 'Dagger';
  }

  return newItem;
}

// ('2ce7f166-a026-43ad-bb6c-7f81985020f5', 'BOW', 200),
function openBowLootbox(playerWhoOpenedId) {
  const newItem = {
    uuid: v4(),
    owner: '',
    type: '',
    value: 0,
    name: '',
  };

  newItem.owner = playerWhoOpenedId;
  newItem.type = 'BOW';

  // Bow Lootbox: Shortbow (1) or Longbow (2)
  const randomItemType = randomNumberInsideRange(1, 2);

  if (randomItemType === 1) {
    newItem.value = randomNumberInsideRange(90, 400); // Shortbow
    newItem.name = 'Shortbow';
  }

  if (randomItemType === 2) {
    newItem.value = randomNumberInsideRange(150, 300); // Longbow
    newItem.name = 'Longbow';
  }

  return newItem;
}

// ('143cfbb1-6067-4010-a496-f0da94703569', 'CLOTH', 90);
function openClothLootbox(playerWhoOpenedId) {
  const newItem = {
    uuid: v4(),
    owner: '',
    type: '',
    value: 0,
    name: '',
  };

  newItem.owner = playerWhoOpenedId;
  newItem.type = 'CLOTH';

  // Bow Lootbox: Wizard Clothes (1), Robber Clothes (2) or Warrior Clothes (3)
  const randomItemType = randomNumberInsideRange(1, 3);

  if (randomItemType === 1) {
    newItem.value = randomNumberInsideRange(60, 120); // Wizard Clothes
    newItem.name = 'Wizard Clothes';
  }

  if (randomItemType === 2) {
    newItem.value = randomNumberInsideRange(80, 100); // Robber Clothes
    newItem.name = 'Robber Clothes';
  }

  if (randomItemType === 3) {
    newItem.value = randomNumberInsideRange(50, 140); // Warrior Clothes
    newItem.name = 'Warrior Clothes';
  }

  return newItem;
}

function listLootboxes(_req, res) {
  database.lootBox.listLootboxes()
    .then((listOfLootboxes) => res.status(200).send(listOfLootboxes))
    .catch((err) => res.status(500).send({
      message: 'Internal Server Error :(',
      error: err,
    }));
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
      return res.status(400).send({
        message: 'You dont have enough money :(',
      });
    }

    // Material Lootbox
    if (lootBox.type === 'MATERIAL') {
      const newItem = openMaterialLootbox(player.uuid);

      await database.lootBox.addItemToPlayer(newItem);
      await database.lootBox.buyLootbox(player.uuid, lootBox);

      return res.status(200).send(newItem);
    }

    // Sword Lootbox
    if (lootBox.type === 'SWORD') {
      const newItem = openSwordLootbox(player.uuid);

      await database.lootBox.addItemToPlayer(newItem);
      await database.lootBox.buyLootbox(player.uuid, lootBox);

      return res.status(200).send(newItem);
    }

    // Bow Lootbox
    if (lootBox.type === 'BOW') {
      const newItem = openBowLootbox(player.uuid);

      await database.lootBox.addItemToPlayer(newItem);
      await database.lootBox.buyLootbox(player.uuid, lootBox);

      return res.status(200).send(newItem);
    }

    // Cloth Lootbox
    if (lootBox.type === 'CLOTH') {
      const newItem = openClothLootbox(player.uuid);

      await database.lootBox.addItemToPlayer(newItem);
      await database.lootBox.buyLootbox(player.uuid, lootBox);

      return res.status(200).send(newItem);
    }
  } catch (err) {
    return res.status(400).send({
      message: `Error while buying lootboxes ${err.message}`,
    });
  }
  return res.status(400).send({
    message: 'Error while buying lootboxes',
  });
}

module.exports = {
  listLootboxes,
  buyLootboxes,
};
