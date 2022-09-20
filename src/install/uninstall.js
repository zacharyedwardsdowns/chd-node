import os from 'os';
import fs from 'fs';
import chalk from 'chalk';
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

const chdAlias = "alias chd='. ";

export function uninstall() {
  process.chdir(os.homedir());

  let file;
  if (process.platform === 'linux') {
    file = '.bash_aliases';
  } else {
    file = '.bash_profile';
  }

  fs.readFile(file, 'utf-8', (error, data) => {
    if (error) {
      console.log(chalk.red(`Failed to read the file ~/${file}`));
      console.log(
        chalk.red(
          `If the file exists please remove the line beginning with "${chdAlias}" manually to complete uninstall`
        )
      );
      console.log(chalk.red('Check error.log for more details'));
      log.error(error);
    } else {
      // Find and remove line containing chdAlias
      let aliasRemoved = removeAlias(data);

      // Overwrite file with chdAlias line removed
      fs.writeFile(file, aliasRemoved, (error) => {
        if (error) {
          console.log(
            chalk.red(
              `Failed to remove line beginning with "${chdAlias}" from ~/${file}`
            )
          );
          console.log(chalk.red('Please consider removing it yourself'));
          console.log(chalk.red('Check error.log for more details'));
          log.error(error);
        } else {
          console.log(
            chalk.greenBright(
              `Removed alias for the chd.sh wrapper from ~/${file}`
            )
          );
        }
      });
    }
  });
}

function removeAlias(data) {
  let dataArray = data.split('\n');

  for (let i = 0; i < dataArray.length; i++) {
    if (dataArray[i].startsWith(chdAlias)) {
      dataArray.splice(i, 1);
      break;
    }
  }

  return dataArray.join('\n');
}
