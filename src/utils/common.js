/**
 * kintone api - nodejs client
 * Common function
 */
const KintoneExeption = require('../exception/KintoneAPIException');

const CONTENT_TYPE_KEY = 'Content-Type';
const CONTENT_TYPE_VALUE = 'application/json';

class Common {
  /**
     * @param {String} method
     * @param {String} url
     * @param {RecordModle} model
     * @param {Connection} connection
     * @return {Promise} Promise
     */
  sendRequest(method, url, model, connection) {
    const body = model.toJSON ? model.toJSON() : model;
    connection.setHeader(CONTENT_TYPE_KEY, CONTENT_TYPE_VALUE);
    return connection.request(method, url, body)
      .then((result) => {
        return result;
      }).catch((err) => {
        throw new KintoneExeption(err);
      });
  }

}

module.exports = new Common();
