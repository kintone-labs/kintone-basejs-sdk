/**
 * kintone api - nodejs client
 * File module
 */

const KintoneConnection = require('../../connection/Connection');
const FileModel = require('../../model/file/FileModels');
const common = require('../../utils/Common');

const kintoneConnection = new WeakMap();

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
    if (!(connection instanceof KintoneConnection)) {
      throw new Error(`${connection}` +
                `not an instance of kintoneConnection`);
    }
    kintoneConnection.set(this, connection);
  }
  /**
     * @param {String} method
     * @param {String} url
     * @param {RecordModle} model
     * @return {Promise} Promise
     */
  sendRequest(method, url, model) {
    return common.sendRequest(method, url, model, kintoneConnection.get(this));
  }
  /**
     * Download file from kintone
     * @param {String} fileKey
     * @return {Promise}
     */
  download(fileKey) {
    const dataRequest =
            new FileModel.GetFileRequest(fileKey);
    kintoneConnection.get(this).addRequestOption(RESPONSE_TYPE_KEY, RESPONSE_TYPE_VALUE);
    return this.sendRequest('GET', 'FILE', dataRequest.toJSON());
  }
  /**
     * upload file to kintone
     * @param {JSONObjectg} formData
     * @return {Promise}
     */
  upload(formData) {
    kintoneConnection.get(this).setHeader(CONTENT_TYPE_KEY, CONTENT_TYPE_VALUE);
    return this.sendRequest('POST', 'FILE', formData);
  }
}
module.exports = File;
