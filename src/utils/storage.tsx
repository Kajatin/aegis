import Database from "tauri-plugin-sql-api";

import { Code, Settings, User } from "./types";

let db: null | Database = null;

// Connect to SQLite database
export async function connect(): Promise<Database> {
  if (db) return db;
  db = await Database.load("sqlite:aegis.db");
  return db;
}

export async function getUser() {
  const db = await connect();
  // await db.execute("DELETE FROM users WHERE true;");
  const result: Array<User> = await db.select("SELECT * FROM users LIMIT 1;");
  if (result.length > 0) {
    return result[0];
  } else {
    return null;
  }
}

export async function createUser(pubkey: string) {
  const db = await connect();
  await db.execute(
    "INSERT OR IGNORE INTO users (pubkey, privkey) VALUES (?, ?);",
    [pubkey, "privkey is stored in secure storage"]
  );
  const user = await getUser();
  return user;
}

export async function getCodes() {
  const db = await connect();
  const result: Array<Code> = await db.select(
    "SELECT id, name, code FROM codes;"
  );
  return result;
}

export async function createCode(name: string) {
  const db = await connect();
  const code = Math.random().toString(36).substring(2, 8);
  await db.execute("INSERT OR IGNORE INTO codes (name, code) VALUES (?, ?);", [
    name,
    code,
  ]);
  return code;
}

export async function getSetting(key: string) {
  const db = await connect();
  const result: Array<Settings> = await db.select(
    `SELECT value FROM settings WHERE key = "${key}";`
  );
  return result[0]?.value;
}
