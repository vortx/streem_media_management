var config = require('./config/config.json');
var express = require('express');
var request = require('request');
const https = require('https');
var fs = require("fs");
var bodyParser = require('body-parser');
var parseString = require('xml2js').parseString;
const WebSocket = require('ws');
const systemInfo = require('./modules/system_info')
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

var wss
if (config.connect_type === "https") {
  var wss = new WebSocket.Server({httpsServer});
  httpsServer.listen(443, () => {
    console.log('httpS  port 443');
  });
} else {
  wss = new WebSocket.Server({port: config.websoket_server_port});
  console.log('WEBSocket port', config.websoket_server_port)

  app.listen(config.webserver_port, function () {
    console.log('Server start: http://0.0.0.0:' + config.webserver_port);
  });
}

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


//let i = 0
setInterval(function () {
  setTimeout(function () {
    const ws = new WebSocket('ws://localhost:' + config.websoket_server_port);
     systemInfo(ws);
    /*
     const ws = new WebSocket('ws://localhost:' + config.websoket_server_port);
     ws.on('open', function open() {
       ws.send(i);
       ws.close()
     });
     i++
     */
  }, 100);

  request.get('http://localhost:81/stat', 1000, function (error, meta, xml) {

    if (error) {
      io.emit('error', {"error": true});
    }

    parseString(xml, function (err, result) {
/*
      if (err != null) {
        console.log('error', {"error": true});
      } else {
         console.log('error', {"error": false});
      }*/

      if (err != null) {
         console.log('statistics', result);
      } else {
         console.log('statistics', result.rtmp.server[0].application[3].live[0].stream);
      }

    });

  });


}, 2000)



