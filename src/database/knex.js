const knex = require('knex');
const knexfile = require('../../knexfile');

const database = knex(knexfile);
database.inventory = require('./inventory')(database);
database.player = require('./player')(database);
database.trade = require('./trade')(database);
database.auth = require('./auth')(database);

module.exports = { database };
