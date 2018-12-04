"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const server = express();
const logger = require("../logger");

const port = 3001;
const log = console.log.bind(console, "[Device]\t");

module.exports = {
  run() {
    server.use(cors());
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());

    server.listen(port, () => {
      log(`App listening on http://localhost:${port}`);
      let index = 0;
      setInterval(() => {
        logger.sendLog("http://localhost:3003/logger", index++);
      }, 400);
    });
  }
};
