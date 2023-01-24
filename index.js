const dotenv = require("dotenv");
const config = dotenv.config();
const express = require("express");
const serveIndex = require("serve-index");
const path = require("path");
const shopFileBuilder = require("./src/shop-file-builder");
const { nspFullDirPath, appPort } = require("./envs");
var debugLog = require("debug")("tinfoil");
//  Default shop content if no template is provided
default_shop = {
  files: {},
  directories: [],
};

const expressApp = express();
// Serve static files and interface

expressApp.use(shopFileBuilder);

expressApp.use(express.static(path.join(nspFullDirPath)));
expressApp.use(serveIndex(nspFullDirPath, { icons: true, hidden: true }));

const server = expressApp.listen(appPort, function () {
  console.log("debugLog");
  debugLog("server is running at %s", server.address().port);
  debugLog("serving files into %s", nspFullDirPath);
});
