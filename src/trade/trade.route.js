const express = require('express');
const authenticateToken = require('../middleware/authentication');

const router = express.Router();
const tradeService = require('./trade.service');

router.get('/offer', authenticateToken, tradeService.listAllTradeOffersFromPlayer);
router.post('/', authenticateToken, tradeService.sendTradeOffer);
router.post('/offer/:tradeId/accept', authenticateToken, tradeService.acceptTradeOffer);
router.post('/offer/:tradeId/decline', authenticateToken, tradeService.declineTradeOffer);
router.delete('/offer/:tradeId', authenticateToken, tradeService.cancelTradeOffer);

module.exports = router;
