import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { commands, log } from '../chd-node.js';
import {
  addToList,
  close,
  retrieveFromList,
  retrieveFromListByPath,
} from '../db/db.js';

export async function add(name, directory) {
  try {
    if (commands.includes(name)) {
      console.log(chalk.yellowBright('Name cannot be an existing chd command'));
      console.log(chalk.gray('Commands:'), chalk.gray(...commands));
      return;
    }

    if (name.includes('\\') || name.includes('/')) {
      console.log(
        chalk.yellowBright("Name cannot include the characters '\\' or '/'"),
      );
      return;
    }

    if (!directory || !fs.existsSync(directory)) {
      console.log(chalk.yellowBright('Must provide a valid directory'));
      return;
    }

    return await addHelper(name, path.resolve(directory));
  } finally {
    close();
  }
}

async function addHelper(name, absolute) {
  let doReturn = false;
  let directory;

  try {
    directory = await retrieveFromList(name);
  } catch (error) {
    logError(error);
    return;
  }

  if (directory) {
    console.log(chalk.yellowBright(`The name '${name}' already exists`));
    doReturn = true;
  } else {
    try {
      directory = await retrieveFromListByPath(absolute);
    } catch (error) {
      logError(error);
      return;
    }

    if (directory) {
      doReturn = await inquireDuplicate(directory.name);
    }
  }

  if (doReturn) {
    console.log(chalk.gray('Directory was not added'));
    return;
  }

  try {
    await addToList(name, absolute);
  } catch (error) {
    logError(error);
    return;
  }

  console.log(
    chalk.greenBright(`You may now use 'chd ${name}' to cd to '${absolute}'`),
  );
}

async function inquireDuplicate(name) {
  console.log(
    chalk.yellowBright(`This directory already exists under '${name}'\n`),
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
