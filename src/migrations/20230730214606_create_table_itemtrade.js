/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable('itemtrade', (table) => {
  table.uuid('uuid').primary();
  table.uuid('item').notNullable().references('uuid').inTable('item');
  table.uuid('trade').notNullable().references('uuid').inTable('trade');
  table.uuid('recipient').notNullable().references('uuid').inTable('player');
});

/**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
exports.down = (knex) => knex.schema.dropTableIfExists('itemtrade');
