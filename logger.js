const crypto = require("crypto");
const http = require("axios");

const log = console.log.bind(console, "[Device]\t");

module.exports = {
  async sendLog(url, index) {
    const res = await http.post(url, { data: this.generateLog(index) });
  },
  async sendBlock(url, data) {
    const res = await http.post(url, { data });
  },
  generateLog(index) {
    let now = Date.now();
    return {
      time: now,
      data: crypto.randomBytes(10).toString("hex"),
      index
    };
  }
};
