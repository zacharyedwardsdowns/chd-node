import fs from 'fs';
import chalk from 'chalk';
import { log } from '../chd-node.js';
import { retrieveEntireList } from '../util/db.js';

export async function list() {
  const invalidList = [];
  let chdList = [];

  try {
    chdList = retrieveEntireList();
  } catch (error) {
    console.log(chalk.red('Failed to list directories'));
    console.log(chalk.red('Check error.log for more details'));
    log.error(error);
    return;
  }

  chdList?.forEach((item, index) => {
    if (!fs.existsSync(item.path)) {
      chdList.splice(index, 1);
      invalidList.push(item);
    }
  });

  if (chdList?.length) {
    console.log(chalk.greenBright('-----------------------'));
    console.log(chalk.greenBright(' Supported Directories '));
    console.log(chalk.greenBright('-----------------------'));

    chdList.forEach((item) => {
      console.log(chalk.blue(item.name), item.path);
    });

    console.log(chalk.greenBright('-----------------------'));
  } else {
    console.log(chalk.yellowBright('No supported directories found'));
  }

  displayInvalidList(invalidList);
}

function displayInvalidList(invalidList) {
  if (invalidList?.length) {
    console.log('');

    console.log(chalk.yellowBright('-----------------------'));
    console.log(chalk.yellowBright('  Invalid Directories  '));
    console.log(chalk.yellowBright('-----------------------'));

    invalidList.forEach((item) => {
      console.log(chalk.red(item.name), item.path);
    });

    console.log(chalk.yellowBright('-----------------------'));
  }
}
