var express = require('express');
const https = require('https');
var fs = require("fs");
var config = require('./config/config.json');
var bodyParser = require('body-parser');
var app = express();

//sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3000
//node --nouse-idle-notification server_express.js

// Certificate SSL
if (config.connect_type === "https") {
  var privateKey = fs.readFileSync(config.privateKey, 'utf8');
  var certificate = fs.readFileSync(config.certificate, 'utf8');
  var ca = fs.readFileSync(config.ca, 'utf8');

  var credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };
  var httpsServer = https.createServer(credentials, app);
}

// отключение CORS
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'origin, content-type, accept');
  next();
}


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.urlencoded({extended: true}));
app.use(allowCrossDomain);
app.set("view engine", "ejs");

// подключили роутер
var pathRouter = require('./config/router');
app.use('/', pathRouter);

if (config.connect_type === "https") {
  httpsServer.listen(443, () => {
    console.log('httpS  port 443');
  });
} else {
  app.listen(3000, function () {
    console.log('http port 3000!');
  });
}