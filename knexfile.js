const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  client: 'pg',
  version: process.env.PG_VERSION,
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  },
  migrations: {
    directory: 'src/migrations',
  },
};
