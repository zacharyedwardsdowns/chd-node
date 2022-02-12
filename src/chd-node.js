#! /usr/bin/env node

import path from 'path';
import { program } from 'commander';
import { fileURLToPath } from 'url';
import { add } from './commands/add.js';
import { list } from './commands/list.js';
import { userDataDir } from './util/user-data.js';
import { changeDirectory } from './commands/cd.js';
import { deleteDirectory } from './commands/delete.js';

export const commands = ['list', 'add', 'delete'];

// Ensure the script always runs in the chd project directory.
let replace;
if (process.platform === 'win32') {
  replace = '\\';
} else {
  replace = '/';
}
const dir = path.dirname(fileURLToPath(import.meta.url));
process.chdir(dir.substring(0, dir.lastIndexOf(replace)));

program
  .command('list')
  .description('list all directories and their names')
  .action(list);
program
  .command('add <name> [directory]')
  .description('add given/current directory under name')
  .action(add);
program
  .command('delete <name>')
  .description('delete name from supported directories')
  .action(deleteDirectory);
program
  .argument('<name>')
  .description(
    'cd to the directory represented by name\n\n- data directory -\n"' +
      userDataDir() +
      '"'
  )
  .action(changeDirectory);

program.parse();
