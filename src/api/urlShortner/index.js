const express = require('express');

const controller = require('./urlShortner.controller');

const router = express.Router();

router.post('/shorten', controller.shorten);
router.post('/deleteRecord', controller.deleteRecord);

module.exports = router;
