const Connection = require('../../connection/Connection');

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
