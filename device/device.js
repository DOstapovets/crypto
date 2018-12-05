"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const config = require("../config");
const server = express();
const logger = require("../logger");

const port = 3001;
const log = console.log.bind(console, "[Device]\t");

module.exports = {
  run(config) {
    server.use(cors());
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());
    server.listen(port, () => {
      log(`App listening on http://localhost:${port}`);
      let index = 0;
      let prevBlockSize = 0;
      let time = config.currentTime;
      let data = [];
      setInterval(() => {
        data.push(logger.getEvent());
      }, 200);
      //  Math.random() * config.timeout + 0.2 * config.timeout
      setInterval(() => {
        if (data.length) {
          let block = logger.sendLog(
            "http://localhost:3003/logger",
            index++,
            data,
            prevBlockSize,
            config
          );

          time = block.time;
          prevBlockSize = block.size;
          data = [];
        }
      }, config.timeout);
    });
  }
};
