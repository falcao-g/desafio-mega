const express = require('express');
const authenticateToken = require('../middleware/authentication');

const router = express.Router();
const inventoryService = require('./inventory.service');

router.get('/:playerId', authenticateToken, inventoryService.listAllItemsFromPlayer);
router.get('/:playerId/item/:itemId', authenticateToken, inventoryService.getItemDetails);
router.post('/sell', authenticateToken, inventoryService.sellItemFromPlayer);

module.exports = router;
