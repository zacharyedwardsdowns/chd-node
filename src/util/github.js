import open from 'open';
import chalk from 'chalk';
import config from 'config';
import fetch from 'node-fetch';
import { log } from '../chd-node.js';
import { setTimeout as sleep } from 'timers/promises';
import { DeviceCodeResponse } from '../model/device-code-response.js';
import { AccessTokenResponse } from '../model/access-token-response.js';

const APPLICATION_JSON = 'application/json';

export async function authorize() {
  const deviceCodeBody = JSON.stringify({
    client_id: config.get('github.clientId'), // Cannot be kept secret as part of a CLI application.
    scope: config.get('github.scope'),
  });

  const deviceCodeResponse = await fetch(config.get('github.deviceCodeUri'), {
    method: 'POST',
    body: deviceCodeBody,
    headers: { 'Content-Type': APPLICATION_JSON, Accept: APPLICATION_JSON },
  });

  const deviceCodeData = new DeviceCodeResponse(
    await deviceCodeResponse.json()
  );

  console.log(
    'Use code ' +
      chalk.greenBright(deviceCodeData.user_code) +
      ' to authorize chd-node with GitHub.'
  );

  await sleep(2000);
  open(deviceCodeData.verification_uri);

  return await accessToken(deviceCodeData);
}

async function accessToken(deviceCodeData) {
  const accessTokenBody = JSON.stringify({
    client_id: config.get('github.clientId'),
    device_code: deviceCodeData.device_code,
    grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
  });

  const interval = deviceCodeData.interval * 1000;
  const expired = (deviceCodeData.expires_in - 10) * 1000 - interval;

  return pollAccessToken(accessTokenBody, Date.now(), interval, expired);
}

async function pollAccessToken(accessTokenBody, start, interval, expired) {
  await sleep(interval);

  if (Date.now() - start < expired) {
    const accessTokenResponse = await fetch(
      config.get('github.accessTokenUri'),
      {
        method: 'POST',
        body: accessTokenBody,
        headers: { 'Content-Type': APPLICATION_JSON, Accept: APPLICATION_JSON },
      }
    );

    const accessTokenData = new AccessTokenResponse(
      await accessTokenResponse.json()
    );

    switch (accessTokenData?.error) {
      case undefined:
        break;
      case 'authorization_pending':
        return pollAccessToken(accessTokenBody, start, interval, expired);
      case 'slow_down':
        return pollAccessToken(
          accessTokenBody,
          start,
          accessTokenData?.interval * 1000,
          expired
        );
      case 'expired_token':
        console.log(
          chalk.red("Device code expired! You'll need to try again.")
        );
        return null;
      case 'access_denied':
        console.log(
          chalk.red(
            "You denied access! If you want use chd-node's import and export features you'll need to authorize it with GitHub."
          )
        );
        return null;
      default:
        console.log(accessTokenData?.error);
        log.error(accessTokenData);
        console.log(
          chalk.red(
            'Unexpected error code received during authorization. Error written to log file.'
          )
        );
        return null;
    }

    console.log(chalk.greenBright('Authorization successful!'));
    return accessTokenData?.access_token;
  }

  console.log(
    chalk.red("Timed out waiting for authorization! You'll need to try again.")
  );
  return null;
}
