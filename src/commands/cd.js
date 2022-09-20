import fs from 'fs';
import chalk from 'chalk';
import persist from 'node-persist';
import { persistDir, userDataDir } from '../util/user-data.js';
import { transports, createLogger, format } from 'winston';
import { program } from 'commander';
const { combine, timestamp, json, errors } = format;

const log = createLogger({
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: new transports.File({
    filename: userDataDir() + '/log/error.log',
    level: 'error',
  }),
});

const slash = process.platform === 'win32' ? '\\' : '/';

export async function changeDirectory(name) {
  let extra = '';

  if (!name) {
    program.outputHelp();
    console.log(chalk.red("\nPlease provide a named directory 'chd <name>'"));
    return;
  }

  if (name.includes('\\') || name.includes('/')) {
    if (process.platform === 'win32' && name.includes('/')) {
      name = name.replace(new RegExp('/', 'g'), '\\');
    }

    const index = name.indexOf(slash);
    extra = slash + name.slice(index + 1);
    name = name.slice(0, index);
  }

  try {
    await persist.init({ dir: persistDir() });
    let directory = await persist.getItem(name);

    if (!directory) {
      console.log(chalk.yellowBright(`No directory named '${name}' exists`));
      return;
    }

    directory += extra;

    if (!fs.existsSync(directory)) {
      console.log(
        chalk.yellowBright(`The directory '${directory}' does not exist`)
      );
      return;
    }

    console.log(directory);
  } catch (error) {
    console.log(chalk.red('Failed to cd to the given directory!'));
    console.log(chalk.red('Check error.log for more details'));
    log.error(error);
    return;
  }
}
