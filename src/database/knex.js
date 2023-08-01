const knex = require('knex');
const knexfile = require('../../knexfile');

const database = knex(knexfile);

database.trade = require('./trade')(database);

module.exports = { database };
