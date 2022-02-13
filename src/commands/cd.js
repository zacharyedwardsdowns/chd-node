import fs from 'fs';
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

export async function changeDirectory(name) {
  try {
    await persist.init({ dir: persistDir() });
    const directory = await persist.getItem(name);

    if (!directory) {
      console.log(chalk.yellowBright(`No directory named '${name}' exists`));
      return;
    }

    if (!fs.existsSync(directory)) {
      console.log(
        chalk.yellowBright(`The directory '${directory}' does not exist`)
      );
      return;
    }

    console.log(directory);
  } catch (error) {
    console.log(chalk.red('Failed to list directories'));
    console.log(chalk.red('Check error.log for more details'));
    log.error(error);
    return;
  }
}
