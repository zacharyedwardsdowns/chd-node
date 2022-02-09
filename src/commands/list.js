import chalk from 'chalk';
import persist from 'node-persist';

export async function list() {
  await persist.init();
  const chdList = await persist.data();

  console.log(chalk.greenBright('---------------------'));
  console.log(chalk.greenBright('Supported Directories'));
  console.log(chalk.greenBright('---------------------'));

  chdList.forEach((item) => {
    console.log(chalk.blue(item.key), item.value);
  });

  console.log(chalk.greenBright('---------------------'));
}
