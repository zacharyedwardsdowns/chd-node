#! /usr/bin/env node

import os from 'os';
import fs from 'fs';
import chalk from 'chalk';
import { transports, createLogger, format } from 'winston';
const { combine, timestamp, json } = format;

const log = createLogger({
  format: combine(timestamp(), json()),
  transports: new transports.File({
    filename: 'log/error.log',
    level: 'error',
  }),
});

process.chdir(os.homedir());

const chdAlias = "alias chd='. ";

fs.readFile('.bash_profile', 'utf-8', (error, data) => {
  if (error) {
    console.log(chalk.red(`Failed to read the file ~/.bash.profile`));
    console.log(
      chalk.red(
        `If the file exists please remove the line beginning with "${chdAlias}" manually to complete uninstall`
      )
    );
    console.log(chalk.red('Check error.log for more details'));
    log.error(error);
  } else {
    // Find and remove line containing chdAlias
    let dataArray = data.split('\n');

    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i].startsWith(chdAlias)) {
        dataArray.splice(i, 1);
        break;
      }
    }

    let aliasRemoved = dataArray.join('\n');

    // Overwrite file with chdAlias line removed
    fs.writeFile('.bash_profile', aliasRemoved, (error) => {
      if (error) {
        console.log(
          chalk.red(
            `Failed to remove line beginning with "${chdAlias}" from ~/.bash.profile`
          )
        );
        console.log(chalk.red('Please consider removing it yourself'));
        console.log(chalk.red('Check error.log for more details'));
        log.error(error);
      } else {
        console.log(
          chalk.greenBright(
            'Removed alias for the chd.sh wrapper from .bash_profile'
          )
        );
      }
    });
  }
});
