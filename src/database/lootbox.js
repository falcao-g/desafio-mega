module.exports = (knex) => {
  function listLootboxes() {
    return knex('lootbox')
      .select('*')
      .orderBy('price', 'asc');
  }

  function findOneLootbox(uuid) {
    return knex('lootbox')
      .select('uuid', 'type', 'price')
      .where({ uuid })
      .first();
  }

  function addItemToPlayer(newItem) {
    return knex('item')
      .insert({
        uuid: newItem.uuid,
        owner: newItem.owner,
        type: newItem.type,
        value: newItem.value,
        name: newItem.name,
      });
  }

  async function buyLootbox(playerUuid, lootbox) {
    return knex.transaction(async (trx) => {
      await trx('player')
        .where('uuid', playerUuid)
        .decrement('balance', lootbox.price);
    });
  }

  return {
    listLootboxes,
    buyLootbox,
    findOneLootbox,
    addItemToPlayer,
  };
};
