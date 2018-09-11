const Connection = require('../../connection/Connection');
const FileModel = require('../../model/file/FileModels');
const common = require('../../utils/Common');

const CONTENT_TYPE_KEY = 'Content-Type';
const CONTENT_TYPE_VALUE = 'multipart/form-data';
const RESPONSE_TYPE_KEY = 'responseType';
const RESPONSE_TYPE_VALUE = 'arraybuffer';

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
    const dataRequest =
            new FileModel.GetFileRequest(fileKey);
    this.connection.addRequestOption(RESPONSE_TYPE_KEY, RESPONSE_TYPE_VALUE);
    return this.sendRequest('GET', 'FILE', dataRequest.toJSON());
  }
  /**
     * upload file to kintone
     * @param {JSONObjectg} formData
     * @return {Promise}
     */
  upload(formData) {
    this.connection.setHeader(CONTENT_TYPE_KEY, CONTENT_TYPE_VALUE);
    return this.sendRequest('POST', 'FILE', formData);
  }
}
module.exports = File;
