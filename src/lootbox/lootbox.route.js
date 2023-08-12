const express = require('express');
const authenticateToken = require('../middleware/authentication');

const router = express.Router();
const lootboxController = require('./lootbox.controller');

router.get('/shop', authenticateToken, lootboxController.listLootboxes);
router.post('/shop/:lootboxId', authenticateToken, lootboxController.buyLootboxes);

module.exports = router;
