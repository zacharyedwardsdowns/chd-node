import os from 'os';
import fs from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { log } from '../chd-node.js';
import { userDataDir } from '../util/user-data.js';

const chdAlias = "alias chd='. ";

export async function uninstall() {
  process.chdir(os.homedir());

  let file;
  if (process.platform === 'linux') {
    file = '.bash_aliases';
  } else {
    file = '.bash_profile';
  }

  fs.readFile(file, 'utf-8', async (error, data) => {
    if (error) {
      console.log(chalk.red(`Failed to read the file ~/${file}`));
      console.log(
        chalk.red(
          `If the file exists please remove the line beginning with "${chdAlias}" manually to complete uninstall`
        )
      );
      console.log(chalk.red('Check error.log for more details'));
      log.error(error);
      await userData();
    } else {
      // Find and remove line containing chdAlias
      let aliasRemoved = removeAlias(data);

      // Overwrite file with chdAlias line removed
      fs.writeFile(file, aliasRemoved, async (error) => {
        if (error) {
          console.log(
            chalk.red(
              `Failed to remove line beginning with "${chdAlias}" from ~/${file}`
            )
          );
          console.log(chalk.red('Please consider removing it yourself'));
          console.log(chalk.red('Check error.log for more details'));
          log.error(error);
          await userData();
        } else {
          console.log(
            chalk.greenBright(
              `Removed alias for the chd.sh wrapper from ~/${file}`
            )
          );
          await userData();
        }
      });
    }
  });
}

async function userData() {
  log.close();
  let keep = await inquireUserData();

  if (keep) {
    console.log(chalk.gray(`User data remains in '${userDataDir()}'`));
  } else {
    fs.rmSync(userDataDir(), { recursive: true, force: true });
    console.log(chalk.gray('User data removed'));
  }
}

async function inquireUserData() {
  console.log('');

  try {
    const answer = await inquirer.prompt([
      {
        name: 'userData',
        message: 'Would you like to keep your user data?',
        type: 'list',
        choices: ['Yes', 'No'],
      },
    ]);

    console.log('');
    return answer.userData === 'Yes';
  } catch {
    console.log(chalk.gray('\nFailed to load prompt...\n'));

    return false;
  }
}

function removeAlias(data) {
  let dataArray = data.split('\n');

  for (let i = 0; i < dataArray.length; i++) {
    if (dataArray[i].startsWith(chdAlias)) {
      dataArray.splice(i, 1);
      break;
    }
  }

  return dataArray.join('\n');
}
