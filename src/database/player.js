module.exports = (knex) => {
  function findOne(uuid) {
    return knex('player')
      .select('uuid', 'name', 'login', 'balance', 'picturePath')
      .where({ uuid })
      .first();
  }

  function incrementBalanceOfPlayer(playerUuid, balanceIncrement) {
    return knex('player')
      .increment({ balance: balanceIncrement })
      .where({ uuid: playerUuid });
  }

  function update(player) {
    return knex('player')
      .update(player)
      .where({ uuid: player.uuid });
  }

  return {
    findOne,
    incrementBalanceOfPlayer,
    update,
  };
};
