#! /usr/bin/env node

import os from 'os';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { userDataDir } from '../util/user-data.js';
import { transports, createLogger, format } from 'winston';
const { combine, timestamp, json, errors } = format;

const log = createLogger({
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: new transports.File({
    filename: userDataDir() + '/log/error.log',
    level: 'error',
  }),
});

let replace;
if (process.platform === 'win32') {
  replace = '\\';
} else {
  replace = '/';
}

let dir = path.dirname(fileURLToPath(import.meta.url));
dir = dir.substring(0, dir.lastIndexOf(replace));

// Change to git bash compatible uri
if (process.platform === 'win32') {
  const letter = dir.charAt(0).toLowerCase();
  dir = dir.replaceAll('\\', '/');
  dir = dir.substring(2, dir.length);
  dir = `/${letter}${dir}`;
}

const chdAlias = `alias chd='. ${dir}/chd.sh'\n`;
const chdExists = "alias chd='. ";

process.chdir(os.homedir());

let file;
if (process.platform === 'linux') {
  file = '.bash_aliases';
} else {
  file = '.bash_profile';
}

fs.readFile(file, 'utf-8', (error, data) => {
  let append = true;

  if (error) {
    console.log(chalk.gray(`Failed to read the file ~/${file}`));
    console.log(chalk.gray(`Will attempt to append alias anyways\n`));
    log.error(error);
  }
  if (data) {
    let dataArray = data.split('\n');

    for (const line of dataArray) {
      if (line.startsWith(chdExists)) {
        console.log(chalk.gray('chd alias already exists'));
        console.log(chalk.gray('skipping postinstall'));
        append = false;
        break;
      }
    }
  }

  if (append) {
    fs.appendFile(file, chdAlias, (error) => {
      if (error) {
        console.log(chalk.red(`Failed to add "${chdAlias}" to ~/${file}`));
        console.log(chalk.red('Please consider adding it yourself'));
        console.log(chalk.red('Check error.log for more details'));
        log.error(error);
      } else {
        console.log(
          chalk.greenBright(
            `Updated ~/${file} with alias for the chd.sh wrapper`
          )
        );
      }
    });
  }
});
