export class DeviceCodeResponse {
  constructor(object) {
    this.device_code = object?.device_code;
    this.user_code = object?.user_code;
    this.verification_uri = object?.verification_uri;
    this.expires_in = object?.expires_in;
    this.interval = object?.interval;
  }
}
