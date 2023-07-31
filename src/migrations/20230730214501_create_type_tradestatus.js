/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.raw('CREATE TYPE tradestatus AS ENUM ( \'PENDING\', \'ACCEPTED\', \'RECUSED\', \'CANCELED\' );');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.raw('DROP TYPE IF EXISTS tradestatus;');
