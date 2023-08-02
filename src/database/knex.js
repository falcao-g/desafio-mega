const knex = require('knex');
const knexfile = require('../../knexfile');

const database = knex(knexfile);
database.inventory = require('./inventory')(database);

module.exports = { database };
