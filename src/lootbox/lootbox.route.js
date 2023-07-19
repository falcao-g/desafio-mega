const express = require('express');

const router = express.Router();
const lootboxController = require('./lootbox.controller');

router.get('/shop', lootboxController.listLootboxes);
router.post('/shop', lootboxController.buyLootboxes);

module.exports = router;
