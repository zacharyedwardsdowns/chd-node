import chalk from 'chalk';
import persist from 'node-persist';
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
        chalk.yellow(
          `No directory named '${name}' exists so nothing was deleted`
        )
      );
    }
  } catch (error) {
    console.log(chalk.red('Failed to delete directory'));
    console.log(chalk.red('Check error.log for more details'));
    log.error(error);
    return;
  }
}
