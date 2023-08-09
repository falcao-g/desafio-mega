const express = require('express');

const router = express.Router();
const playerService = require('./player.service');

router.get('/', playerService.getPlayerInfo);
router.get('/:playerId', playerService.getPlayerInfo);
router.put('/', playerService.editPlayerInfo);
router.post('/balance/deposit', playerService.depositFunds);

module.exports = router;
