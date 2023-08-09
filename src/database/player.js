module.exports = (knex) => {
  function findOne(uuid) {
    return knex('player')
      .select('uuid', 'name', 'balance', 'picturePath')
      .where({ uuid })
      .first();
  }

  function incrementeBalanceOfPlayer(playerUuid, balanceIncrement) {
    return knex('player')
      .increment({ balance: balanceIncrement })
      .where({ uuid: playerUuid });
  }

  return {
    findOne,
    incrementeBalanceOfPlayer,
  };
};
