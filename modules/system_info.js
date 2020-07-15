"use strict"
var config = require('../config/config.json');
const WebSocket = require('ws');
var os = require("os");

function serializInfo() {
  let paramsData = {}

  //memory info
  let totalMemory = (os.totalmem() / 1024 / 1000 / 1024).toFixed(2)
  let freeMemory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
  let usageMemory = (totalMemory - freeMemory).toFixed(2)

  //server uptime info
  let uptimeServer = os.uptime()
  let d = uptimeServer;
  let h = Math.floor(d / 3600);
  let m = Math.floor(d % 3600 / 60);
  let s = Math.floor(d % 3600 % 60);
  let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  let mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  uptimeServer = (hDisplay + mDisplay + sDisplay).toString()


  // add to hash
  paramsData.totalMemory = totalMemory
  paramsData.freeMemory = freeMemory
  paramsData.usageMemory = usageMemory
  paramsData.uptimeServer = uptimeServer
  // paramsData.uptimeServer = uptimeServer

  return paramsData
}

var resultSystemInfo = function(ws) {
  ws.on('open', function open() {
    ws.send(JSON.stringify(serializInfo()));
    ws.close()
  });
}


module.exports = resultSystemInfo;