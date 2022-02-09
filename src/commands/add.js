import persist from 'node-persist';

export async function add(name, directory) {
  await persist.init();
  await persist.setItem(name, directory);
}
