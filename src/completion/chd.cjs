#! /usr/bin/env node

const yargs = require('yargs/yargs');

let argv = require('yargs/yargs')(process.argv.slice(2));

argv.completion('completion', function (current, argv) {
  // 'current' is the current command being completed.
  // 'argv' is the parsed arguments so far.
  // simply return an array of completions.
  return ['list', 'add', 'delete'];
});

argv.showCompletionScript();
