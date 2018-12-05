"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("../logger");
const server = express();

const port = 3002;
let lstIndex = 0;
const log = console.log.bind(console, "[Collect]\t");

let queue = [];

module.exports = {
  run(config) {
    server.use(cors());
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());
    let time = config.currentTime;

    server.listen(port, () => {
      log(`App listening on http://localhost:${port}`);
      setInterval(async () => {
        let blocks = await logger.getBlock("http://localhost:3003/logger");
        blocks.data.forEach(element => {
          if (element.index == 0 && !queue.length) {
            queue.push(element);
            log("Success verify");
          } else {
            if (element.index - queue[queue.length - 1].index == 1)
              if (
                element.time - queue[queue.length - 1].time > config.timeout &&
                element.time - queue[queue.length - 1].time < 2 * config.timeout
              ) {
                //TODO: check index1-index2>1
                queue.push(element);

                log("Success verify");
              } else {
                log("Warning invalid date");
                queue.push(element);
              }
          }
        });
      }, config.timeout);
    });
  }
};
