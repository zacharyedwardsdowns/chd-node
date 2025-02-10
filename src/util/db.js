import chalk from 'chalk';
import Database from 'better-sqlite3';
import { userDataDir, databaseFile } from './user-data.js';
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, json, errors } = format;

const log = createLogger({
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: new transports.File({
    filename: userDataDir() + '/log/error.log',
    level: 'error',
  }),
});

const db = initDb();

function initDb() {
  try {
    // Create db and table if they don't exist
    const db = new Database(databaseFile());
    db.exec('CREATE TABLE IF NOT EXISTS chdlist(name TEXT PRIMARY KEY, path TEXT NOT NULL)')
    return db;
  } catch (error) {
    logError(error);
  }
}

export function retrieveEntireList() {
  const statement = db.prepare('SELECT name, path FROM chdlist');
  return statement.all();
}

export function retrieveFromList(name) {
  const statement = db.prepare('SELECT name, path FROM chdlist WHERE name = ?');
  return statement.get(name);
}

export function retrieveFromListByPath(path) {
  const statement = db.prepare('SELECT name, path FROM chdlist WHERE path = ?');
  return statement.get(path);
}

export function addToList(name, path) {
  const statement = db.prepare('INSERT INTO chdlist (name, path) VALUES (?, ?)');
  statement.run(name, path);
}

export function deleteFromList(name) {
  const statement = db.prepare('DELETE FROM chdlist WHERE name = ?');
  return statement.run(name);
}

export function renameKeyInList(name, newName) {
  const statement = db.prepare('UPDATE chdlist SET name = ? WHERE name = ?');
  return statement.run(newName, name);
}

function logError(error) {
  console.log(chalk.red('Failed to setup the SQLite database'));
  console.log(chalk.red('Check error.log for more details'));
  log.error(error);
}