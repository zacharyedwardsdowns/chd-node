import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import persist from 'node-persist';
import { commands } from '../chd-node.js';
import { persistDir, userDataDir } from '../util/user-data.js';
import { transports, createLogger, format } from 'winston';
const { combine, timestamp, json } = format;

const log = createLogger({
  format: combine(timestamp(), json()),
  transports: new transports.File({
    filename: userDataDir() + '/log/error.log',
    level: 'error',
  }),
});

export async function add(name, directory) {
  let absolute;

  if (!directory) {
    directory = process.cwd();
  }

  if (fs.existsSync(directory)) {
    absolute = path.resolve(directory);
  } else {
    console.log(chalk.yellowBright('Must provide a valid directory'));
    return;
  }

  if (commands.includes(name)) {
    console.log(chalk.yellowBright('Name cannot be an existing chd command'));
    console.log(chalk.gray('Commands:'), chalk.gray(...commands));
  }

  return addHelper(name, absolute);
}

async function addHelper(name, absolute) {
  let chdList = [];

  try {
    await persist.init({ dir: persistDir() });
    chdList = await persist.data();
  } catch (error) {
    logError(error);
    return;
  }

  if (chdList && chdList.length) {
    let doReturn = false;

    for (const item of chdList) {
      if (item.key === name) {
        console.log(chalk.yellowBright(`The name '${name}' already exists`));
        doReturn = true;
      } else if (item.value === absolute) {
        doReturn = await inquireDuplicate(item.key);
        break;
      }
    }

    if (doReturn) {
      console.log(chalk.gray('Directory was not added'));
      return;
    }
  }

  try {
    await persist.setItem(name, absolute);
  } catch (error) {
    logError(error);
    return;
  }

  console.log(
    chalk.greenBright(`You may now use 'chd ${name}' to cd to '${absolute}'`)
  );
}

async function inquireDuplicate(name) {
  console.log(
    chalk.yellowBright(`This directory already exists under '${name}'\n`)
  );

  try {
    const answer = await inquirer.prompt([
      {
        name: 'existing',
        message: 'Would you like to have it under both names?',
        type: 'list',
        choices: ['Yes', 'No'],
      },
    ]);

    console.log('');
    return answer.existing !== 'Yes';
  } catch {
    console.log(chalk.gray('\nFailed to load prompt...\n'));

    return false;
  }
}

function logError(error) {
  console.log(chalk.red('Failed to add directory'));
  console.log(chalk.red('Check error.log for more details'));
  log.error(error);
}
