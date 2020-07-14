var config = require('./config.json');
var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('index', {connect_type: config.connect_type, hostname: config.websoket_server_host})
});

router.get('/login', function (req, res) {
  res.render('login', {connect_type: config.connect_type, hostname: config.websoket_server_host})
});

router.get('/sign_out', function (req, res) {
  res.status(301).redirect("/login")
});

router.get('/playlist', function (req, res) {
  res.render('playlist', {connect_type: config.connect_type, hostname: config.websoket_server_host})
});

router.get('/overlay_cam', function (req, res) {
  res.render('overlay_cam', {connect_type: config.connect_type, hostname: config.websoket_server_host})
});


router.post('/post', function (req, res) {
  res.send('ok');
  //res.end();
});

module.exports = router;
