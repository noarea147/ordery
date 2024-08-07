/* eslint func-names: "off" */
require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("../helpers/logger");

module.exports = function () {
  let mongoconnectionlink = process.env.MONGODB_URL;
  mongoose.set("strictQuery", false);
  mongoose.connect(mongoconnectionlink, { useUnifiedTopology: true });
  mongoose.connection
    .once("open", () => {
      logger.info(
        `Connected to MongoDB [CLIENT ENVIRMOMENT]: ${process.env.NODE_ENV}`
      );
    })
    .on("error", (error) => {
      logger.error("Connection error:", error);
    });
};
