const express = require('express');

const router = express.Router();
const inventoryController = require('./inventory.controller');

router.get('/:playerId', inventoryController.getPlayerInventory);
router.get('/:playerId/item/:itemId', inventoryController.getItemDetails);
router.post('/sell', inventoryController.sellItem);

module.exports = router;
