module.exports = (knex) => {
  function findAllItemsFromPlayer(playerUuid) {
    return knex('item')
      .select('*')
      .where({ owner: playerUuid })
      .orderBy('value', 'name');
  }

  function getItemDetails(playerUuid, itemUuid) {
    return knex('item')
      .select('*')
      .where({ owner: playerUuid })
      .andWhere({ uuid: itemUuid });
  }

  return { findAllItemsFromPlayer, getItemDetails };
};
