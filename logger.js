const crypto = require("crypto");
const http = require("axios");
const merkle = require("merkle-lib");
const fastRoot = require("merkle-lib/fastRoot");

const log = console.log.bind(console, "[Device]\t");

function sha256(data) {
  return crypto
    .createHash("sha256")
    .update(data)
    .digest();
}

module.exports = {
  sendLog(url, index, arr, prevBlockSize, config) {
    const data = this.generatBlock(index, arr, prevBlockSize, config);

    http.post(url, { data });
    return data;
  },
  getBlock(url) {
    return http.get(url);
  },
  generatBlock(index, data, prevBlockSize, config) {
    let now = Date.now();
    let obj = { index, time: now, prevBlockSize };
    obj.size = Buffer.from(JSON.stringify(obj)).byteLength;
    obj.encryption = 1;
    obj.gzip = 0;
    obj.payload = {
      data,
      initVector: Array.from({ length: data.length }, () =>
        Math.floor(Math.random() * 65535)
      )
    };
    obj.payloadHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(obj.payload))
      .digest("hex");
    obj.hash = crypto
      .createHash("sha256")
      .update(
        `${obj.index}${obj.size}${obj.prevBlockSize}${obj.payloadHash}${
          obj.encryption
        }${obj.gzip}`
      )
      .digest("hex");
    let _data = data.map(x => new Buffer(x, "utf8"));

    let tree = merkle(_data, sha256);
    // console.log(data, tree.map(x => x.toString("utf8")));
    const root = fastRoot(_data, sha256);
    obj.rootHash = crypto
      .createHash("sha256")
      .update(`${root.toString("hex")}${obj.payload.initVector}`)
      .digest("hex");

    obj.signature = config.skey
      .encrypt(`${obj.payloadHash}${obj.hash}${obj.rootHash}`)
      .toString("base64");

    return obj;
  },
  getEvent: () => {
    let words = require("./event.json").match(/\w+/gi);
    return words[Math.floor(Math.random() * words.length)];
  }
};
