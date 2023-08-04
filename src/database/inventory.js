module.exports = (knex) => {
  function findAllItemsFromPlayer(playerUuid) {
    return knex('item')
      .select('uuid', 'type', 'value', 'name')
      .where({ owner: playerUuid })
      .orderBy('value', 'name');
  }

  async function getItemDetails(playerUuid, itemUuid) {
    const item = await knex('item')
      .select('*')
      .where({ owner: playerUuid })
      .andWhere({ uuid: itemUuid })
      .first();

    if (!item) {
      return { message: 'Item not found' };
    }

    return item;
  }

  async function sellItem(itemUuid) {
    return knex.transaction(async (trx) => {
      const item = await trx('item')
        .where('uuid', itemUuid)
        .select('value', 'owner')
        .first();

      if (!item) {
        return { message: 'Item not found' };
      }

      await trx('player')
        .where('uuid', item.owner)
        .increment('balance', item.value);

      await trx('item')
        .where('uuid', itemUuid)
        .del();

      return { message: `Item sold successfully for ${item.value}` };
    });
  }

  return { findAllItemsFromPlayer, getItemDetails, sellItem };
};
