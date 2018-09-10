/**
 * kintone api - nodejs client
 */


const axios = require('axios');
const tunnel = require('tunnel');

const KintoneAuth = require('../authentication/Auth');
const KintoneHTTPHeader = require('../model/http/HTTPHeader');

const CONNECTION_CONST = require('./constant');
const DEFAULT_PORT = '443';

const kintoneDomain = new WeakMap();
const kintoneAuth = new WeakMap();
const kintoneGuestSpaceID = new WeakMap();
const headers = new WeakMap();
const options = new WeakMap();

/**
 * Connection module
 */
class Connection {
  /**
     * @param {String} domain
     * @param {KintoneAuth} auth
     * @param {Integer} kintoneGuestSpaceID
     */
  constructor(domain, auth, guestSpaceID) {
    kintoneDomain.set(this, domain);
    kintoneGuestSpaceID.set(this, parseInt(guestSpaceID, 10));

    headers.set(this, []);
    options.set(this, {});
    this.setAuth(auth);
    // set default user-agent
    this.setHeader(
      CONNECTION_CONST.BASE.USER_AGENT,
      CONNECTION_CONST.BASE.USER_AGENT_BASE_VALUE
        .replace('{name}',
          process.env.npm_package_name || 'kintone-basicjs-sdk')
        .replace('{version}', process.env.npm_package_version || '(none)')
    );
  }

  /**
     * request to URL
     * @param {String} method
     * @param {String} restAPIName
     * @param {String} body
     * @return {Promise}
     */
  request(methodName, restAPIName, body) {
    // Set Header
    const headersRequet = {};
    // set header with credentials
    kintoneAuth.get(this).createHeaderCredentials().forEach((httpHeaderObj) => {
      headersRequet[httpHeaderObj.getKey()] = httpHeaderObj.getValue();
    });
    headers.get(this).forEach((httpHeaderObj) => {
      const headerKey = httpHeaderObj.getKey();
      if (headersRequet.hasOwnProperty(headerKey) &&
                headerKey === CONNECTION_CONST.BASE.USER_AGENT) {
        headersRequet[headerKey] += ' ' + httpHeaderObj.getValue();
      } else {
        headersRequet[headerKey] = httpHeaderObj.getValue();
      }
    });

    // Set request options
    const requestOptions = options.get(this);
    requestOptions.method = String(methodName).toUpperCase();
    requestOptions.url = this.getUri(restAPIName);
    requestOptions.headers = headersRequet;
    // set data to param if using GET method
    if (requestOptions.method === 'GET') {
      requestOptions.params = body;
    } else {
      requestOptions.data = body;
    }
    // Execute request
    return axios(requestOptions);
  }
  /**
     * auto get uri for request
     * @param {String} url - api name or FQDN
     * @return {String}
     */
  getUri(url) {
    let urlFQDN = CONNECTION_CONST.BASE.SCHEMA + '://' + kintoneDomain.get(this);
    const apiNameUpperCase = String(url).toUpperCase();
    urlFQDN += ':' + DEFAULT_PORT;
    if (CONNECTION_CONST.PATH.hasOwnProperty(apiNameUpperCase)) {
      urlFQDN += this.getPathURI(apiNameUpperCase);
    } else {
      urlFQDN = (!url.match(/http/)) ? urlFQDN + url : url;
    }
    return urlFQDN;
  }
  /**
     * getPathURI
     * @param {String} apiName
     * @return {String}
     */
  getPathURI(apiName) {
    let pathURI = '';
    if (kintoneGuestSpaceID.get(this) > 0) {
      pathURI +=
                CONNECTION_CONST.BASE.BASE_GUEST_URL
                  .replace(CONNECTION_CONST.BASE.PREFIX_API_NAME,
                    CONNECTION_CONST.PATH[apiName])
                  .replace(CONNECTION_CONST.BASE.PREFIX_GUESTSPACEID,
                    kintoneGuestSpaceID.get(this));
    } else {
      pathURI +=
                CONNECTION_CONST.BASE.BASE_URL
                  .replace(CONNECTION_CONST.BASE.PREFIX_API_NAME,
                    CONNECTION_CONST.PATH[apiName]);
    }
    return pathURI;
  }
  /**
     * Add option for request
     * @param {String} key
     * @param {String} value
     * @return {this}
     */
  addRequestOption(key, value) {
    const currentOption = options.get(this);
    currentOption[key] = value;
    options.set(this, currentOption);
    return this;
  }
  /**
     * set header for request
     * @param {String} key
     * @param {String} value
     * @return {this}
     */
  setHeader(key, value) {
    headers.get(this,
      headers.get(this).push(new KintoneHTTPHeader(key, value)));
    return this;
  }
  /**
     * set auth for connection
     * @param {Auth} auth
     * @return {this}
     */
  setAuth(auth) {
    if (!(auth instanceof KintoneAuth)) {
      throw new Error(`${auth} not an instance of KintoneAuth`);
    }
    kintoneAuth.set(this, auth);
    return this;
  }
  /**
     * Sett proxy for request
     * @param {String} proxyHost
     * @param {String} proxyPort
     * @return {this}
     */
  setProxy(proxyHost, proxyPort) {
    const httpsAgent = tunnel.httpsOverHttp({
      proxy: {
        host: proxyHost,
        port: proxyPort
      },
    });
    this.addRequestOption(CONNECTION_CONST.BASE.PROXY, false);
    this.addRequestOption(CONNECTION_CONST.BASE.HTTPS_AGENT, httpsAgent);
    return this;
  }
}
module.exports = Connection;
