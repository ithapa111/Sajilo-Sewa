import { JsonStore } from "./json-store.js";
import { PostgresStore } from "./postgres-store.js";

export function createStore(rootDir) {
  const driver = (process.env.STORAGE_DRIVER || "json").toLowerCase();

  if (driver === "postgres") {
    return new PostgresStore(rootDir);
  }

  return new JsonStore(rootDir);
}
