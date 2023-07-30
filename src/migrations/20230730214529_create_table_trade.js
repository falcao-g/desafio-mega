/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable('trade', (table) => {
  table.uuid('uuid').primary();
  table.uuid('proposer').notNullable().references('uuid').inTable('player');
  table.uuid('acceptor').notNullable().references('uuid').inTable('player');
  table.specificType('status', 'tradestatus').notNullable().defaultTo('PENDING');
});

/**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
exports.down = (knex) => knex.schema.dropTableIfExists('trade');
