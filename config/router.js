var config = require('./config.json');
var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('index', {connect_type: config.connect_type, hostname: config.websoket_server_host})
});

router.post('/post', function (req, res) {
  res.send('ok');
  //res.end();
});

module.exports = router;
