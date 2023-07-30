/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable('item', (table) => {
  table.uuid('uuid').primary();
  table.uuid('owner').notNullable().references('uuid').inTable('player');
  table.specificType('type', 'itemtype').notNullable();
  table.integer('value').notNullable().defaultTo(0);
  table.string('name').notNullable();
});

/**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
exports.down = (knex) => knex.schema.dropTableIfExists('item');
