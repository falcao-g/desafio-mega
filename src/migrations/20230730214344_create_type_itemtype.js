/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.raw('CREATE TYPE itemtype AS ENUM ( \'MATERIAL\', \'SWORD\', \'BOW\', \'CLOTH\' );');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.raw('DROP TYPE IF EXISTS itemtype;');
