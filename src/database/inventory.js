module.exports = (knex) => {
  function findAllItemsFromPlayer(playerUuid) {
    return knex('item')
      .select('*')
      .where({ owner: playerUuid })
      .orderBy('value', 'name');
  }

  return { findAllItemsFromPlayer };
};
