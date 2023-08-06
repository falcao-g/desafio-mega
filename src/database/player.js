module.exports = (knex) => {
  function findOne(uuid) {
    return knex('player')
      .select('uuid', 'name', 'balance', 'picturePath')
      .where({ uuid })
      .first();
  }

  return {
    findOne,
  };
};
