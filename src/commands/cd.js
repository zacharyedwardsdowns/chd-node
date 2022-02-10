import fs from 'fs';
import chalk from 'chalk';
import persist from 'node-persist';
import { transports, createLogger, format } from 'winston';
const { combine, timestamp, json } = format;

const log = createLogger({
  format: combine(timestamp(), json()),
  transports: new transports.File({
    filename: 'log/error.log',
    level: 'error',
  }),
});

export async function changeDirectory(name) {
  try {
    await persist.init();
    const directory = await persist.getItem(name);

    if (!directory) {
      console.log(chalk.yellow(`No directory named '${name}' exists`));
      return;
    }

    if (!fs.existsSync(directory)) {
      console.log(chalk.yellow(`The directory '${directory}' does not exist`));
      return;
    }

    console.log(directory);
  } catch (error) {
    console.error(chalk.red('Failed to list directories'));
    console.error(chalk.red('Check error.log for more details'));
    log.error(error);
    return;
  }
}
