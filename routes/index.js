var models  = require('../models/index.js');
var express = require('express');
var router  = express.Router();

router.get('/', function (req, res) {
    res.redirect('/polls');
});

module.exports = router;
