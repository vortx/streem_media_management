var express = require('express');
const https = require('https');
var fs = require("fs");
var config = require('./config/config.json');
var bodyParser = require('body-parser');
var parseString = require('xml2js').parseString;
const WebSocket = require('ws');
var app = express();

//sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3000
//node --nouse-idle-notification server_express.js

// Certificate SSL
if (config.connect_type === "https") {
  var privateKey = fs.readFileSync(config.ssl_privateKey, 'utf8');
  var certificate = fs.readFileSync(config.ssl_certificate, 'utf8');
  var ca = fs.readFileSync(config.ssl_ca, 'utf8');

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

app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.urlencoded({extended: true}));
app.use(allowCrossDomain);
app.set("view engine", "ejs");

// подключили роутер
var pathRouter = require('./config/router');
app.use('/', pathRouter);


const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
   // console.log('received: %s', data);
  });
});

let  i =0
setInterval(function () {
  setTimeout(function () {
    const ws = new WebSocket('ws://localhost:8080');
    ws.on('open', function open() {
      ws.send(i);
      ws.close()
    });
i++
  }, 100);
}, 2000)


if (config.connect_type === "https") {
  httpsServer.listen(443, () => {
    console.log('httpS  port 443');
  });
} else {
  app.listen(3000, function () {
    console.log('Server start: http://0.0.0.0:3000');
  });
}

