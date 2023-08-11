const express = require('express');
const authenticateToken = require('../middleware/authentication');

const router = express.Router();
const playerService = require('./player.service');

router.get('/', authenticateToken, playerService.getPlayerInfo);
router.get('/:playerId', authenticateToken, playerService.getPlayerInfo);
router.put('/', authenticateToken, playerService.editPlayerInfo);
router.post('/balance/deposit', authenticateToken, playerService.depositFunds);

module.exports = router;
