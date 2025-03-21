#! /usr/bin/env node

import path from 'path';
import { program } from 'commander';
import { fileURLToPath } from 'url';
import { add } from './commands/add.js';
import { list } from './commands/list.js';
import { rename } from './commands/rename.js';
import { userDataDir } from './util/user-data.js';
import { changeDirectory } from './commands/cd.js';
import { deleteDirectory } from './commands/delete.js';
import { installInstructions } from './commands/install.js';
import { windowsInstructions } from './commands/install.js';
import { transports, createLogger, format } from 'winston';

const { combine, timestamp, json, errors } = format;

export const log = createLogger({
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: new transports.File({
    filename: userDataDir() + '/log/error.log',
    level: 'error'
  })
});

export const commands = [
  'list',
  'add',
  'delete',
  'uninstall',
  'windows',
  'help',
  'rename'
];

// Ensure the script always runs in the chd project directory.
let replace;
if (process.platform === 'win32') {
  replace = '\\';
} else {
  replace = '/';
}
const dir = path.dirname(fileURLToPath(import.meta.url));
process.chdir(dir.substring(0, dir.lastIndexOf(replace)));

program.helpCommand(true);
program
  .command('list')
  .description('list all directories and their names')
  .action(list);
program
  .command('add <name> [directory]')
  .description('add given/current directory under name')
  .action(add);
program
  .command('rename <name>')
  .description('rename an existing directory')
  .action(rename);
program
  .command('delete <name>')
  .description('deletes name from directories list')
  .action(deleteDirectory);
program
  .argument('[name]')
  .description(
    'cd to the directory represented by name\ncd to the subdirectory represented by name/sub-directory\n\n- data directory -\n"' +
    userDataDir() +
    '"'
  )
  .action(changeDirectory);

if (process.platform === 'win32') {
  program
    .command('install')
    .description('provides installation instructions for windows')
    .action(windowsInstructions);
} else {
  program
    .command('install')
    .description('provides installation instruction')
    .action(installInstructions);
}

program.parse();
