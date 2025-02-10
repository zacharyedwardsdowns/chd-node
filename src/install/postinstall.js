#! /usr/bin/env node

import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

let replace;
if (process.platform === 'win32') {
  replace = '\\';
} else {
  replace = '/';
}

let dir = path.dirname(fileURLToPath(import.meta.url));
dir = dir.substring(0, dir.lastIndexOf(replace));

console.log(chalk.cyanBright(`To finish installation append the following to your relevant alias file:`));
console.log(chalk.bgBlack(chalk.magenta(`alias chd='. ${dir}/chd.sh'\n`)));

if (process.platform === 'win32') {
  console.log(chalk.cyanBright(`Run for Command Prompt and Powershell installation instructions:`));
  console.log(chalk.bgBlack(chalk.magenta('chd-node windows')));
}