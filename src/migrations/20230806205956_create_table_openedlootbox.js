/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable('openedlootbox', (table) => {
  table.uuid('uuid').primary();
  table.uuid('lootbox').notNullable().references('uuid').inTable('lootbox');
  table.uuid('player').notNullable().references('uuid').inTable('player');
  table.timestamp('openedAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTableIfExists('openedlootbox');
