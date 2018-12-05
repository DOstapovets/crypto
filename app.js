const config = require("./config").setup();

require("./collector/collector").run(config);
require("./device/device").run(config);
require("./relay/relay").run(config);
