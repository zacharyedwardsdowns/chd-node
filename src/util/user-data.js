export function userDataDir() {
  if (process.platform === 'win32') {
    return `${process.env.APPDATA}\\chd-node`;
  } else {
    return process.platform === 'darwin'
      ? `${process.env.HOME}/Library/Preferences/chd-node`
      : `${process.env.HOME}/.local/share/chd-node`;
  }
}

export function persistDir() {
  if (process.platform === 'win32') {
    return userDataDir() + '\\chdlist';
  } else {
    return userDataDir() + '/chdlist';
  }
}
