const express = require('express');

const router = express.Router();
const authService = require('./auth.service');

router.post('/signup', authService.register);
router.post('/login', authService.access);

module.exports = router;
