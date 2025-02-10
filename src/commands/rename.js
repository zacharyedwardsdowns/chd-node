import chalk from 'chalk';
import inquirer from 'inquirer';
import persist from 'node-persist';
import { commands, log } from '../chd-node.js';
import { persistDir } from '../util/user-data.js';

export async function rename(name) {
  let chdList = [];
  let directory;

  try {
    await persist.init({ dir: persistDir() });
    chdList = await persist.data();
  } catch (error) {
    logError(error);
    return;
  }

  if (chdList?.length) {
    let found = false;

    for (const item of chdList) {
      if (item.key === name) {
        directory = item.value;
        found = true;
      }
    }

    if (!found) {
      console.log(
        chalk.yellowBright(`No directory named '${name}' exists to be renamed`)
      );
      return;
    }
  }

  renameHelper(name, directory);
}

async function renameHelper(name, directory) {
  const newName = await inquireName();

  if (newName === undefined) {
    console.log(chalk.red('Failed to load new name question prompt'));
    console.log(chalk.red('Consider deleting then re-adding the directory'));
  } else if (!newName) {
    console.log(
      chalk.yellowBright('Must provide a name to rename a directory')
    );
  } else if (commands.includes(newName)) {
    console.log(chalk.yellowBright('Name cannot be an existing chd command'));
    console.log(chalk.gray('Commands:'), chalk.gray(...commands));
  } else {
    try {
      await persist.removeItem(name);
      await persist.setItem(newName, directory);
    } catch (error) {
      logError(error, directory);
      return;
    }
    console.log(
      chalk.greenBright(`Renamed '${name}' to '${newName}' successfully`)
    );
  }
}

async function inquireName() {
  try {
    const answer = await inquirer.prompt([
      {
        name: 'new',
        message: 'Provide a new directory name:',
        type: 'input',
      },
    ]);

    console.log('');
    return answer.new;
  } catch {
    console.log(chalk.gray('\nFailed to load prompt...\n'));
    return undefined;
  }
}

function logError(error, directory = null) {
  console.log(chalk.red('Failed to rename directory'));

  if (directory) {
    console.log(chalk.red(directory));
  }

  console.log(chalk.red('Check error.log for more details'));
  log.error(error);
}
