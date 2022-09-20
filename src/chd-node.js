#! /usr/bin/env node

import path from 'path';
import { program } from 'commander';
import { fileURLToPath } from 'url';
import { add } from './commands/add.js';
import { list } from './commands/list.js';
import { rename } from './commands/rename.js';
import { userDataDir } from './util/user-data.js';
import { uninstall } from './install/uninstall.js';
import { changeDirectory } from './commands/cd.js';
import { deleteDirectory } from './commands/delete.js';
import { windowsInstructions } from './commands/windows.js';

export const commands = [
  'list',
  'add',
  'delete',
  'uninstall',
  'windows',
  'help',
  'rename',
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

program.addHelpCommand();
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
  .description('delete name from directories list')
  .action(deleteDirectory);
program
  .command('windows')
  .description('provides installation instructions for windows')
  .action(windowsInstructions);
program
  .command('uninstall')
  .description('remove aliases added by postinstall')
  .action(uninstall);
program
  .argument('[name]')
  .description(
    'cd to the directory represented by name\ncd to the subdirectory represented by name/sub-directory\n\n- data directory -\n"' +
      userDataDir() +
      '"'
  )
  .action(changeDirectory);

program.parse();
