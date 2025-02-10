import chalk from 'chalk';
import persist from 'node-persist';
import { log } from '../chd-node.js';
import { persistDir } from '../util/user-data.js';

export async function deleteDirectory(name) {
  try {
    await persist.init({ dir: persistDir() });
    const details = await persist.removeItem(name);
    if (details.existed) {
      if (details.removed) {
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
