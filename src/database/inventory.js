module.exports = (knex) => {
  function findAllItemsFromPlayer(playerUuid) {
    return knex('item')
      .select('uuid', 'type', 'value', 'name')
      .where({ owner: playerUuid })
      .orderBy('value', 'name');
  }

  async function findOne(itemUuid, playerUuid) {
    const item = await knex('item')
      .select('*')
      .where({ uuid: itemUuid })
      .andWhere({ owner: playerUuid })
      .first();

    return item;
  }

  async function sellOne(item) {
    return knex.transaction(async (trx) => {
      await trx('player')
        .where('uuid', item.owner)
        .increment('balance', item.value);

      await trx('item')
        .where('uuid', item.uuid)
        .del();

      return `Item sold successfully for ${item.value}`;
    });
  }

  function insertOne(item) {
    return knex('item')
      .insert(item);
  }

  function deleteOneById(uuid) {
    return knex('item')
      .del()
      .where({ uuid });
  }

  return {
    findAllItemsFromPlayer,
    findOne,
    sellOne,
    insertOne,
    deleteOneById,
  };
};
