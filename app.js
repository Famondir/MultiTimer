const http = require('http');
const url = require('url');
/*
const yaml = require('js-yaml');
const fs = require('fs');
const jsdom = require("jsdom");
*/
const pathmodule = require('path');

const hostname = 'localhost';
const port = 3000;
const baseDir = __dirname + "/";
const debug = false;

function logDebugMessage(message) {
  if (debug) {
      console.log(message);
  }
}

/**
 * Main Program - Start Server
 */
 const server = http.createServer((req, res) => {
  logDebugMessage(req.url);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      let htmlText = findBySongName(searchName);
      logDebugMessage(htmlText);

      res.end(htmlText);
});
  
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});