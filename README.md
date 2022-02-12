# chd

A command line tool to make changing to frequently visited directories faster by allowing the user to link it to a name.
Then by using 'chd name' the terminal will change to the linked directory.

### Install

Install using npm

`npm install -g chd`

### Uninstall

Recommended to first run uninstall script to remove chd alias

`npm run uninstall`

Then uninstall using npm

`npm uninstall -g chd`

### Usage

A usage guide can be found using:

`chd --help`

To change directory, use a directory name:

`chd name`

To get a list of your linked directories use:

`chd list`

To add onto your current directory use:

`chd add name`

To add onto your list of linked directories use:

`chd add name directory`

To delete an existing linked directory use:

`chd delete name`

#### Original

This is a Node.js implementation of the chd shell project: https://github.com/zacharyedwardsdowns/chd

#### Note

More than one directory name is allowed to point to a single directory, however each directory name must be unique.
