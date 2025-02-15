import fs from 'fs';
import chalk from 'chalk';
import { program } from 'commander';
import { log } from '../chd-node.js';
import { close, retrieveFromList } from '../db/db.js';

const slash = process.platform === 'win32' ? '\\' : '/';

export async function changeDirectory(name) {
  try {
    let extra = '';

    if (!name) {
      program.outputHelp();
      console.log(chalk.red("\nPlease provide a named directory 'chd <name>'"));
      return;
    }

    if (name.includes('\\') || name.includes('/')) {
      if (process.platform === 'win32' && name.includes('/')) {
        name = name.replace(/\//g, '\\');
      }

      const index = name.indexOf(slash);
      extra = slash + name.slice(index + 1);
      name = name.slice(0, index);
    }

    try {
      let directory = await retrieveFromList(name);

      if (!directory) {
        console.log(chalk.yellowBright(`No directory named '${name}' exists`));
        return;
      }

      let path = directory.path;
      path += extra;

      if (!fs.existsSync(path)) {
        console.log(
          chalk.yellowBright(`The directory '${path}' does not exist`),
        );
        return;
      }

      console.log(path);
    } catch (error) {
      console.log(chalk.red('Failed to cd to the given directory!'));
      console.log(chalk.red('Check error.log for more details'));
      log.error(error);
    }
  } finally {
    close();
  }
}
