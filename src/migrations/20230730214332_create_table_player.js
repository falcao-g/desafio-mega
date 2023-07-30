/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable('player', (table) => {
  table.uuid('uuid').primary();
  table.string('login').unique().notNullable();
  table.string('password', 512).notNullable();
  table.string('name');
  table.integer('balance').notNullable().defaultTo(0);
  table.string('picturePath');
});

/**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
exports.down = (knex) => knex.schema.dropTableIfExists('player');
