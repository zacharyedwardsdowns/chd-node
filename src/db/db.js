import pkg from 'pg';
import chalk from 'chalk';
import Database from 'better-sqlite3';
import { userDataDir, databaseFile } from '../util/user-data.js';
import config from '../config/config.json' with { type: 'json' };
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, json, errors } = format;
const { Client, escapeIdentifier } = pkg;

const log = createLogger({
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: new transports.File({
    filename: userDataDir() + '/log/error.log',
    level: 'error',
  }),
});

const table = escapeIdentifier(config?.db?.table);
const type = config?.db?.type;
let postgres;
let sqlite;
await initDb();

async function initDb() {
  // Create db and table if they don't exist
  switch (type) {
    case 'postgres':
      postgres = new Client({
        user: config?.db?.username,
        password: config?.db?.password,
        schema: config?.db?.schema,
        host: config?.db?.host,
        port: config?.db?.port,
        database: config?.db?.database,
      });
      await postgres.connect().catch((error) => {
        logError('Failed to connect to the Postgres database', error);
        process.exit();
      });
      // prettier-ignore
      await postgres.query(`CREATE TABLE IF NOT EXISTS ${table} (name TEXT PRIMARY KEY, path TEXT NOT  NULL )`)
        .catch((error) => {
          logError('Failed to setup the Postgres database', error);
          close();
          process.exit();
        });
      break;
    default:
      try {
        sqlite = new Database(databaseFile());
        sqlite.exec(
          'CREATE TABLE IF NOT EXISTS chdlist (name TEXT PRIMARY KEY, path TEXT NOT NULL)',
        );
      } catch (error) {
        logError('Failed to setup the SQLite database', error);
        process.exit();
      }
  }
}

export async function retrieveEntireList() {
  switch (type) {
    case 'postgres':
      // prettier-ignore
      return await postgres.query(`SELECT name, path FROM ${table}`)
        .then(result => {
          return result.rows;
        })
        .catch((error) => {
          logError('Failed to retrieve chd list from database', error);
          close();
          process.exit();
        });
    default:
      const statement = sqlite.prepare('SELECT name, path FROM chdlist');
      return statement.all();
  }
}

export async function retrieveFromList(name) {
  switch (type) {
    case 'postgres':
      // prettier-ignore
      return await postgres.query(`SELECT name, path FROM ${table} WHERE name = $1`, [name])
        .then((result) => {
          return result.rows?.[0];
        })
        .catch((error) => {
          logError('Failed to retrieve chd directory from database', error);
          close();
          process.exit();
        });
    default:
      const statement = sqlite.prepare(
        'SELECT name, path FROM chdlist WHERE name = ?',
      );
      return statement.get(name);
  }
}

export async function retrieveFromListByPath(path) {
  switch (type) {
    case 'postgres':
      // prettier-ignore
      return await postgres.query(`SELECT name, path FROM ${table} WHERE path = $1`, [path,])
        .then((result) => {
          return result.rows?.[0];
        })
        .catch((error) => {
          logError(
            'Failed to retrieve chd directory path from database',
            error,
          );
          close();
          process.exit();
        });
    default:
      const statement = sqlite.prepare(
        'SELECT name, path FROM chdlist WHERE path = ?',
      );
      return statement.get(path);
  }
}

export async function addToList(name, path) {
  switch (type) {
    case 'postgres':
      // prettier-ignore
      await postgres.query(`INSERT INTO ${table} (name, path) VALUES ($1, $2)`, [name, path])
        .catch((error) => {
          logError('Failed to add chd directory to database', error);
          close();
          process.exit();
        });
      break;
    default:
      const statement = sqlite.prepare(
        'INSERT INTO chdlist (name, path) VALUES (?, ?)',
      );
      statement.run(name, path);
  }
}

export async function deleteFromList(name) {
  switch (type) {
    case 'postgres':
      // prettier-ignore
      return await postgres.query(`DELETE FROM ${table} WHERE name = $1`, [name])
        .then((result) => {
          return {
            changes: result.rowCount
          };
        })
        .catch((error) => {
          logError('Failed to delete chd directory from database', error);
          close();
          process.exit();
        });
    default:
      const statement = sqlite.prepare('DELETE FROM chdlist WHERE name = ?');
      return statement.run(name);
  }
}

export async function renameKeyInList(name, newName) {
  switch (type) {
    case 'postgres':
      // prettier-ignore
      return await postgres.query(`UPDATE ${table} SET name = $1 WHERE name = $2`, [newName, name])
        .then((result) => {
          return result;
        })
        .catch((error) => {
          logError('Failed to rename chd directory in database', error);
          close();
          process.exit();
        });
    default:
      const statement = sqlite.prepare(
        'UPDATE chdlist SET name = ? WHERE name = ?',
      );
      return statement.run(newName, name);
  }
}

function logError(message, error) {
  console.log(chalk.red(message));
  console.log(chalk.red('Check error.log for more details'));
  log.error(error);
}

export function close() {
  switch (type) {
    case 'postgres':
      postgres.end();
      break;
    default:
      sqlite.close();
  }
}
