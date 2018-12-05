const NodeRSA = require("node-rsa");

module.exports = {
  setup() {
    let config = {};
    config.skey = new NodeRSA({ b: 512 });
    config.key = new NodeRSA({ b: 512 });
    config.identifier = 1;
    config.timeout = 1000;
    config.space = 256;
    config.currentTime = Date.now();
    config.signature = config.skey
      .encrypt(
        Buffer.from(
          `${config.identifier}${config.skey
            .exportKey("components-private")
            .n.toString("utf8")}${config.key
            .exportKey("components-public")
            .n.toString("utf8")}${config.timeout}${config.space}${
            config.currentTime
          }`
        )
      )
      .toString("base64");
    return config;
  }
};
