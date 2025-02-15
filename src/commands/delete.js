import chalk from 'chalk';
import { log } from '../chd-node.js';
import { close, deleteFromList, retrieveFromList } from '../db/db.js';

export async function deleteDirectory(name) {
  try {
    const directory = await retrieveFromList(name);

    if (directory) {
      const details = await deleteFromList(name);
      if (details.changes) {
        console.log(
          chalk.greenBright(`Deleted '${name}' from supported directories.`),
        );
      } else {
        console.log(
          chalk.red(`Directory '${name}' exists but failed to delete`),
        );
      }
    } else {
      console.log(
        chalk.yellowBright(
          `No directory named '${name}' exists so nothing was deleted`,
        ),
      );
    }
  } catch (error) {
    console.log(chalk.red('Failed to delete directory'));
    console.log(chalk.red('Check error.log for more details'));
    log.error(error);
  } finally {
    close();
  }
}
