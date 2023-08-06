const express = require('express');

const router = express.Router();
const inventoryController = require('./trade.controller');

router.post('/', inventoryController.sendTradeOffer);
router.post('/offer', inventoryController.acceptOrDeclineTradeOffer);
router.get('/offer', inventoryController.listAllTradeOffers);
router.delete('/offer/:tradeId', inventoryController.cancelTradeOffer);

module.exports = router;
