module.exports = (knex) => {
  function findAllItemsFromPlayer(playerUuid) {
    return knex('item')
      .select('uuid', 'type', 'value', 'name')
      .where({ owner: playerUuid })
      .orderBy('value', 'name');
  }

  function getItemDetails(playerUuid, itemUuid) {
    return knex('item')
      .select('*')
      .where({ owner: playerUuid })
      .andWhere({ uuid: itemUuid })
      .first();
  }

  async function sellItem(itemUuid) {
    const item = await knex('item')
      .where('uuid', itemUuid)
      .select('value', 'owner')
      .first();

    if (!item) {
      return 'Item not found';
    }

    await knex('player')
      .where('uuid', item.owner)
      .increment('balance', item.value);

    await knex('item')
      .where('uuid', itemUuid)
      .del();

    return `Item sold successfully for ${item.value}`;
  }

  return { findAllItemsFromPlayer, getItemDetails, sellItem };
};
