const app = require("./app");
const port = process.env.PORT || 3000;
const LOG = require("./helpers/logger");
const server = require("http").createServer(app);
server.listen(port, () => {
  LOG.info(`Client Server started on port ${port}`);
});

module.exports = server;