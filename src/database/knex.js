const knex = require('knex');
const knexfile = require('../../knexfile');

const database = knex(knexfile);

module.exports = { database };
