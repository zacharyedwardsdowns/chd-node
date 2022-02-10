#! /usr/bin/env node

import { program } from 'commander';
import { add } from './commands/add.js';
import { list } from './commands/list.js';
import { deleteDirectory } from './commands/delete.js';

export const commands = ['list', 'add', 'delete'];

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

program.parse();
