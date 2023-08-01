/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.alterTable('trade', (table) => {
  table.timestamp('sentAt', { useTz: true }).notNullable().notNullable().defaultTo(knex.fn.now());
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.alterTable('trade', (table) => {
  table.dropColumn('sentAt');
});
