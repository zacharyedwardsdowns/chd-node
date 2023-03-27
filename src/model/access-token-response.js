export class AccessTokenResponse {
  constructor(object) {
    this.access_token = object?.access_token;
    this.token_type = object?.token_type;
    this.scope = object?.scope;
    this.error = object?.error;
    this.error_description = object?.error_description;
    this.error_uri = object?.error_uri;
    this.interval = object?.interval;
  }
}
