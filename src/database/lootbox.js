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
  };
};
