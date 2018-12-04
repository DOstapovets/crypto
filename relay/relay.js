"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const server = express();
const queue = [];
const MAX_BLOCK = 5;
const logger = require("../logger");

function addToStack(msg) {
  if (queue.length >= MAX_BLOCK) queue.shift();
  queue.push(msg);
}

const port = 3003;
const log = console.log.bind(console, "[Relay]  \t");

module.exports = {
  run() {
    server.use(cors());
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());

    server.post("/logger", (req, res) => {
      let msg = req.body.data;
      addToStack(msg);
      //log(queue);
      res.json({ res: "Ok" });
    });

    server.listen(port, () => {
      log(`App listening on http://localhost:${port}`);
      setInterval(
        () =>
          logger.sendBlock("http://localhost:3002/logger", queue.splice(0, 5)),
        1300
      );
    });
  }
};
