# chd

[![Built with Devbox](https://www.jetify.com/img/devbox/shield_galaxy.svg)](https://www.jetify.com/devbox/docs/contributor-quickstart/)

A command line tool to make changing to frequently visited directories faster by allowing the user to link it to a name.
Then by using 'chd name' the terminal will change to the linked directory.

---

### Install

Install using npm

`npm i -g chd-node`

It should then prompt you to add an alias for chd

Alias instructions for CMD and Powershell on Windows

`chd-node windows`

---

### Uninstall

Uninstall using npm

`npm un -g chd-node`

Then remove the chd alias from your alias file

---

### Usage

A usage guide can be found using:

`chd help`

To change directory, use a directory name:

`chd name`

To change to a subdirectory, use a directory name + /subdirectory:

`chd name/sub-directory`

To get a list of your linked directories use:

`chd list`

To add onto your current directory use:

`chd add name`

To add onto your list of linked directories use:

`chd add name directory`

To rename an existing linked directory use:

`chd rename name`

To delete an existing linked directory use:

`chd delete name`

#### Windows Only Commands

Installation instructions for Command Prompt and Powershell:

`chd windows`

---

#### Original

This is a Node.js implementation of the shell project:<br>https://github.com/zacharyedwardsdowns/chd

#### Note

More than one directory name is allowed to point to a single directory, however each directory name must be unique.
