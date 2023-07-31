const api = require('express')();
const bodyParser = require('body-parser');
require('dotenv').config();
const authRouter = require('./auth/auth.route');
const inventoryRouter = require('./inventory/inventory.route');
const tradeRouter = require('./trade/trade.route');
const lootboxRouter = require('./lootbox/lootbox.route');

api.use(bodyParser.json());

api.get('/', (req, res) => {
  res.send({ message: 'API online!' });
});

api.use('/auth', authRouter);
api.use('/inventory', inventoryRouter);
api.use('/trade', tradeRouter);
api.use('/lootbox', lootboxRouter);

module.exports = { api };
