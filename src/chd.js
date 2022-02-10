#! /usr/bin/env node

import { program } from 'commander';
import { add } from './commands/add.js';
import { list } from './commands/list.js';

export const commands = ['list', 'add', 'delete'];

program
  .command('list')
  .description('list all directories and their names')
  .action(list);
program
  .command('add <name> [directory]')
  .description('add given/current directory under name')
  .action(add);

program.parse();
