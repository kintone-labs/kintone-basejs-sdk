/**
 * kintone api - nodejs client
 */

const AUTH_CONST = require('./constant');
const KintoneCredential = require('../model/authentication/Credential');
const KintoneHTTPHeader = require('../model/http/HTTPHeader');

const basicAuth = new WeakMap();
const passwordAuth = new WeakMap();
const kintoneApiToken = new WeakMap();
/**
 * Authentication module
 */
class Auth {
  /**
     * setBasicAuth
     * @param {String} username
     * @param {String} password
     * @return {this}
     */
  setBasicAuth(username, password) {
    basicAuth.set(this, new KintoneCredential(username, password));
    return this;
  }

  /**
     * getBasicAuth
     * @return {KintoneCredential}
     */
  getBasicAuth() {
    return basicAuth.get(this);
  }

  /**
     * setPasswordAuth
     * @param {String} username
     * @param {String} password
     * @return {this}
     */
  setPasswordAuth(username, password) {
    passwordAuth.set(this, new KintoneCredential(username, password));
    return this;
  }

  /**
     * getPasswordAuth
     * @return {KintoneCredential}
     */
  getPasswordAuth() {
    return passwordAuth.get(this);
  }

  /**
     * setApiToken
     * @param {String} apiToken
     * @return {this}
     */
  setApiToken(apiToken) {
    kintoneApiToken.set(this, apiToken);
    return this;
  }


  /**
     * getApiToken
     * @return {String}
     */
  getApiToken() {
    return kintoneApiToken.get(this);
  }
  /**
     * createHeaderCredentials
     * @return {Array<HTTPHeader>}
     */
  createHeaderCredentials() {
    const headerCredentials = [];
    if (kintoneApiToken.get(this)) {
      headerCredentials.push(new KintoneHTTPHeader(
        AUTH_CONST.HEADER_KEY_AUTH_APITOKEN, kintoneApiToken.get(this)));
    }
    if (basicAuth.get(this)) {
      headerCredentials.push(new KintoneHTTPHeader(
        AUTH_CONST.HEADER_KEY_AUTH_BASIC,
        'Basic ' + (new Buffer(
          basicAuth.get(this).getUsername() +
                    ':' + basicAuth.get(this).getPassword()).toString('base64'))
      ));
    }
    if (passwordAuth.get(this)) {
      headerCredentials.push(new KintoneHTTPHeader(
        AUTH_CONST.HEADER_KEY_AUTH_PASSWORD,
        new Buffer(
          passwordAuth.get(this).getUsername() +
                    ':' +
                    passwordAuth.get(this).getPassword()).toString('base64')
      ));
    }
    return headerCredentials;
  }
}

module.exports = Auth;
