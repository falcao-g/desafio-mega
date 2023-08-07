const express = require('express');

const router = express.Router();
const inventoryService = require('./inventory.service');

router.get('/:playerId', inventoryService.listAllItemsFromPlayer);
router.get('/:playerId/item/:itemId', inventoryService.getItemDetails);
router.post('/sell', inventoryService.sellItemFromPlayer);

module.exports = router;
