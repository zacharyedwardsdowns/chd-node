import fs from 'fs';
import chalk from 'chalk';
import { log } from '../chd-node.js';
import persist from 'node-persist';
import { persistDir } from '../util/user-data.js';

export async function list() {
  const invalidList = [];
  let chdList = [];

  try {
    await persist.init({ dir: persistDir() });
    chdList = await persist.data();
  } catch (error) {
    console.log(chalk.red('Failed to list directories'));
    console.log(chalk.red('Check error.log for more details'));
    log.error(error);
    return;
  }

  chdList.forEach((item, index) => {
    if (!fs.existsSync(item.value)) {
      chdList.splice(index, 1);
      invalidList.push(item);
    }
  });

  if (chdList && chdList.length) {
    console.log(chalk.greenBright('-----------------------'));
    console.log(chalk.greenBright(' Supported Directories '));
    console.log(chalk.greenBright('-----------------------'));

    chdList.forEach((item) => {
      console.log(chalk.blue(item.key), item.value);
    });

    console.log(chalk.greenBright('-----------------------'));
  } else {
    console.log(chalk.yellowBright('No supported directories found'));
  }

  displayInvalidList(invalidList);
}

function displayInvalidList(invalidList) {
  if (invalidList && invalidList.length) {
    console.log('');

    console.log(chalk.yellowBright('-----------------------'));
    console.log(chalk.yellowBright('  Invalid Directories  '));
    console.log(chalk.yellowBright('-----------------------'));

    invalidList.forEach((item) => {
      console.log(chalk.red(item.key), item.value);
    });

    console.log(chalk.yellowBright('-----------------------'));
  }
}
