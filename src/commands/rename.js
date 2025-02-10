import chalk from 'chalk';
import inquirer from 'inquirer';
import { commands, log } from '../chd-node.js';
import { renameKeyInList, retrieveFromList } from '../util/db.js';

export async function rename(name) {
  let directory;

  try {
    directory = retrieveFromList(name);
  } catch (error) {
    logError(error);
    return;
  }

  if (!directory) {
    console.log(
      chalk.yellowBright(`No directory named '${name}' exists to be renamed`)
    );
    return;
  }

  await renameHelper(directory.name, directory.path);
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
      if (retrieveFromList(newName)) {
        console.log(chalk.yellowBright(`The name '${newName}' already exists`));
        return;
      } else {
        renameKeyInList(name, newName);
      }
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
        type: 'input'
      }
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
