const { JsonStore } = require("./json-store");
const { PostgresStore } = require("./postgres-store");

function createStore(rootDir) {
  const driver = (process.env.STORAGE_DRIVER || "json").toLowerCase();

  if (driver === "postgres") {
    return new PostgresStore(rootDir);
  }

  return new JsonStore(rootDir);
}

module.exports = {
  createStore
};
