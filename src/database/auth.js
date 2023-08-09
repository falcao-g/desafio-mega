const { v4 } = require('uuid');

module.exports = (knex) => {
  async function findOne(login) {
    const item = await knex('player')
      .select('*')
      .where({ login })
      .first();

    return item;
  }

  async function registerPlayer(name, login, password) {
    const uuid = v4();
    await knex('player').insert({
      uuid,
      name,
      login,
      password,
    });

    return 'Player created';
  }

  return { findOne, registerPlayer };
};
