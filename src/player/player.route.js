const express = require('express');
const authenticateToken = require('../middleware/authentication');
const upload = require('../middleware/imageUpload');

const router = express.Router();
const playerService = require('./player.service');

router.get('/', authenticateToken, playerService.getPlayerInfo);
router.get('/:playerId', authenticateToken, playerService.getPlayerInfo);
router.put('/', authenticateToken, upload.single('image'), playerService.editPlayerInfo);
router.post('/balance/deposit', authenticateToken, playerService.depositFunds);

module.exports = router;
