#! /usr/bin/env node

import os from 'os';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { transports, createLogger, format } from 'winston';
const { combine, timestamp, json } = format;

const log = createLogger({
  format: combine(timestamp(), json()),
  transports: new transports.File({
    filename: 'log/error.log',
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

console.log(chdAlias);

process.chdir(os.homedir());

fs.appendFile('.bash_profile', chdAlias, (error) => {
  if (error) {
    console.log(chalk.red(`Failed to add "${chdAlias}" to ~/.bash.profile`));
    console.log(chalk.red('Please consider adding it yourself'));
    console.log(chalk.red('Check error.log for more details'));
    log.error(error);
  } else {
    console.log(
      chalk.greenBright(
        'Updated .bash_profile with alias for the chd.sh wrapper'
      )
    );
  }
});
