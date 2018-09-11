const axios = require('axios');
const tunnel = require('tunnel');

const Auth = require('../authentication/Auth');
const HTTPHeader = require('../model/http/HTTPHeader');

const CONNECTION_CONST = require('./constant');
const DEFAULT_PORT = '443';

/**
 * Connection module
 */
class Connection {
  /**
     * @param {String} domain
     * @param {Auth} auth
     * @param {Integer} guestSpaceID
     */
  constructor(domain, auth, guestSpaceID) {
    this.domain = domain;
    this.guestSpaceID = parseInt(guestSpaceID, 10);

    this.headers = [];
    this.options = {};

    this.setAuth(auth);
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
    this.auth.createHeaderCredentials().forEach((httpHeaderObj) => {
      headersRequet[httpHeaderObj.getKey()] = httpHeaderObj.getValue();
    });
    this.headers.forEach((httpHeaderObj) => {
      const headerKey = httpHeaderObj.getKey();
      if (headersRequet.hasOwnProperty(headerKey) && headerKey === CONNECTION_CONST.BASE.USER_AGENT) {
        headersRequet[headerKey] += ' ' + httpHeaderObj.getValue();
      } else {
        headersRequet[headerKey] = httpHeaderObj.getValue();
      }
    });

    // Set request options
    const requestOptions = this.options;
    requestOptions.method = String(methodName).toUpperCase();
    requestOptions.url = this.getUri(restAPIName);
    requestOptions.headers = headersRequet;
    requestOptions.withCredentials = true;
    // set data to param if using GET method
    if (requestOptions.method === 'GET') {
      requestOptions.params = body;
    } else {
      requestOptions.data = body;
    }

    // Execute request
    return axios(requestOptions).then(rsp => {
      return rsp.data;
    });
  }
  /**
     * auto get uri for request
     * @param {String} url - api name or FQDN
     * @return {String}
     */
  getUri(url) {
    let urlFQDN = CONNECTION_CONST.BASE.SCHEMA + '://' + this.domain;
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
    if (this.guestSpaceID > 0) {
      pathURI += CONNECTION_CONST.BASE.BASE_GUEST_URL.replace(CONNECTION_CONST.BASE.PREFIX_API_NAME, CONNECTION_CONST.PATH[apiName])
        .replace(CONNECTION_CONST.BASE.PREFIX_GUESTSPACEID, this.guestSpaceID);
    } else {
      pathURI += CONNECTION_CONST.BASE.BASE_URL.replace(CONNECTION_CONST.BASE.PREFIX_API_NAME, CONNECTION_CONST.PATH[apiName]);
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
    this.options[key] = value;
    return this;
  }
  /**
     * set header for request
     * @param {String} key
     * @param {String} value
     * @return {this}
     */
  setHeader(key, value) {
    this.headers.push(new HTTPHeader(key, value));
    return this;
  }
  /**
     * set auth for connection
     * @param {Auth} auth
     * @return {this}
     */
  setAuth(auth) {
    if (!(auth instanceof Auth)) {
      throw new Error(`${auth} not an instance of Auth`);
    }
    this.auth = auth;
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
      proxy: {host: proxyHost, port: proxyPort}
    });
    this.addRequestOption(CONNECTION_CONST.BASE.PROXY, false);
    this.addRequestOption(CONNECTION_CONST.BASE.HTTPS_AGENT, httpsAgent);
    return this;
  }
}
module.exports = Connection;
