const dotenv = require("dotenv").config();
const app = require("./app");
const db = require("./db");
const redis = require("./redis");
const configs = require("../configs");

const startServer = (app, port) => {
  try {
    app.listen(port, () => {
      console.log(`🚀 Server is up and running at: http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error.message);
    process.exit(1);
  }
};

startServer(app, configs.server.port);
