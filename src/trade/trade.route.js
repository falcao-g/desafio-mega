const express = require('express');

const router = express.Router();
const tradeController = require('./trade.controller');
const tradeService = require('./trade.service');

// New Routes
// router.get('/offer', tradeService.listAllTradeOffersFromPlayer);
router.post('/', tradeService.sendTradeOffer);
// router.post('/offer/:tradeId/accept', tradeService.acceptTradeOffer);
// router.post('/offer/:tradeId/decline', tradeService.declineTradeOffer);
// router.delete('/offer/:tradeId', tradeService.cancelTradeOffer);

// Old Routes
// router.post('/', tradeController.sendTradeOffer);
router.post('/offer', tradeController.acceptOrDeclineTradeOffer);
router.get('/offer', tradeController.listAllTradeOffers);
router.delete('/offer/:tradeId', tradeController.cancelTradeOffer);

module.exports = router;
