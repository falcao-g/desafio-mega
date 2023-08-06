const express = require('express');

const router = express.Router();
const tradeService = require('./trade.service');

router.get('/offer', tradeService.listAllTradeOffersFromPlayer);
router.post('/', tradeService.sendTradeOffer);
router.post('/offer/:tradeId/accept', tradeService.acceptTradeOffer);
router.post('/offer/:tradeId/decline', tradeService.declineTradeOffer);
router.delete('/offer/:tradeId', tradeService.cancelTradeOffer);

module.exports = router;
