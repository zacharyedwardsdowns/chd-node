#! /usr/bin/env node

import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

export function installInstructions() {
  let dir = path.dirname(fileURLToPath(import.meta.url));
  dir = dir.substring(0, dir.lastIndexOf('/'));

  console.log(chalk.cyanBright(`To finish installation append the following to your relevant alias file:`));
  console.log(chalk.bgBlack(chalk.magenta(`alias chd='. ${dir}/chd.sh'\n`)));
}

export function windowsInstructions() {
  let dir = path.dirname(fileURLToPath(import.meta.url));
  dir = dir.substring(0, dir.lastIndexOf('\\') + 1) + 'windows';

  console.log(chalk.cyanBright('----------------'));
  console.log(chalk.cyanBright(' Command Prompt '));
  console.log(chalk.cyanBright('----------------'));
  console.log(chalk.cyanBright('Add the following directory to PATH'));
  console.log(chalk.cyanBright(dir));
  console.log('');
  console.log(chalk.cyanBright('----------------'));
  console.log(chalk.cyanBright('   Powershell   '));
  console.log(chalk.cyanBright('----------------'));
  console.log(
    chalk.cyanBright(
      'Add the following to C:\\Users\\<User>\\Documents\\WindowsPowerShell\\profile.ps1'
    )
  );
  console.log(chalk.cyanBright(`Set-Alias chd '${dir}\\chd.ps1'`));
}
