#! /usr/bin/env node

import { program } from 'commander';
import { add } from './commands/add.js';
import { list } from './commands/list.js';

program.command('list').description('').action(list);
program.command('add <name> <directory>').description('').action(add);
program.parse();
