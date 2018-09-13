const Connection = require('../../connection/Connection');
const common = require('../../utils/Common');

/**
 * File module
 */
class File {
  /**
     * The constructor for this module
     * @param {Connection} connection
     */
  constructor(connection) {
    if (!(connection instanceof Connection)) {
      throw new Error(`${connection} not an instance of Connection`);
    }
    this.connection = connection;
  }
  /**
     * @param {String} method
     * @param {String} url
     * @param {RecordModle} model
     * @return {Promise} Promise
     */
  sendRequest(method, url, model) {
    return common.sendRequest(method, url, model, this.connection);
  }
  /**
     * Download file from kintone
     * @param {String} fileKey
     * @return {Promise}
     */
  download(fileKey) {
    return this.connection.download(fileKey);
  }
  /**
     * upload file to kintone
     * @param {JSONObjectg} formData
     * @return {Promise}
     */
  upload(formData) {
    return this.connection.upload(formData);
  }
}
module.exports = File;
