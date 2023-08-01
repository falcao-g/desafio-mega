module.exports = (knex) => {
  function findAllTradesFromPlayer(playerUuid) {
    return knex('trade')
      .select('*')
      .where({ proposer: playerUuid })
      .orWhere({ acceptor: playerUuid })
      .orderBy('sentAt', 'desc');
  }

  return { findAllTradesFromPlayer };
};
