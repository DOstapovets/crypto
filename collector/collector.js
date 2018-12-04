"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const server = express();

const port = 3002;
const log = console.log.bind(console, "[Collect]\t");

module.exports = {
  run() {
    server.use(cors());
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());

    server.post("/logger", (req, res) => {
      log(req.body);
      res.json("Ok");
    });

    server.listen(port, () => {
      log(`App listening on http://localhost:${port}`);
    });
  }
};
