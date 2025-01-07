const { default: Redis } = require("ioredis");
const configs = require("../configs");

// Initialize Redis client using the provided URI
const redisClient = new Redis(configs.redis.uri);

// Event listeners for connection success and error handling
redisClient.on("connect", () => {
  console.log("✅ Connect To Redis Successfully.");
});

redisClient.on("error", (error) => {
  console.error("❌ Redis connection error:", error);
  redisClient.quit();
});

module.exports = redisClient; // Export the Redis client for reuse
