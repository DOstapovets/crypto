"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const server = express();
let queue = [];
const logger = require("../logger");

function addToStack(msg) {
  while (currentSpace + msg.size > config.space) {
    let el = queue.shift();
    if (el) currentSpace -= el.size;
  }
  queue.push(msg);
  currentSpace += msg.size;
}
let config;
const port = 3003;
const log = console.log.bind(console, "[Relay]  \t");
let currentSpace = 0;

module.exports = {
  run(conf) {
    config = conf;
    server.use(cors());
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());

    server.post("/logger", (req, res) => {
      let msg = req.body.data;
      if (msg.size > config.size) {
        res.json({ err: "Too long" });
      } else {
        addToStack(msg);
        res.json({ res: "Ok" });
      }
    });

    server.get("/logger", (req, res) => {
      res.json(queue);
      currentSpace = 0;
      queue = [];
    });

    server.listen(port, () => {
      log(`App listening on http://localhost:${port}`);
    });
  }
};
