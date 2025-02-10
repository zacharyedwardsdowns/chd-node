import chalk from 'chalk';
import { log } from '../chd-node.js';
import { deleteFromList, retrieveFromList } from '../util/db.js';

export async function deleteDirectory(name) {
  try {
    const directory = retrieveFromList(name);

    if (directory) {
      const details = deleteFromList(name)
      if (details.changes) {
        console.log(
          chalk.greenBright(`Deleted '${name}' from supported directories.`)
        );
      } else {
        console.log(
          chalk.red(`Directory '${name}' exists but failed to delete`)
        );
      }
    } else {
      console.log(
        chalk.yellowBright(
          `No directory named '${name}' exists so nothing was deleted`
        )
      );
    }
  } catch (error) {
    console.log(chalk.red('Failed to delete directory'));
    console.log(chalk.red('Check error.log for more details'));
    log.error(error);
  }
}
