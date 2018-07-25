/**
 * kintone api - nodejs client
 * File module
 */

const KintoneExeption = require('../../exception/KintoneAPIException');
const KintoneConnection = require('../../connection/Connection');
const FileModel = require('../../model/file/FileModels');

const connection = new WeakMap();

/**
 * File module
 */
class File {
  /**
     * The constructor for this module
     * @param {Connection} connectionInput
     */
  constructor(connectionInput) {
    if (!(connectionInput instanceof KintoneConnection)) {
      throw new Error(`${connectionInput}` +
                `not an instance of kintoneConnection`);
    }
    connection.set(this, connectionInput);
  }
  /**
     * Download file from kintone
     * @param {String} fileKey
     * @return {Promise}
     */
  download(fileKey) {
    const dataRequest =
            new FileModel.GetFileRequest(fileKey);
    return connection.get(this)
      .addRequestOption('json', true)
      .addRequestOption('encoding', null)
      .request('GET', 'FILE', dataRequest.toJSON())
      .then((result) => {
        return result;
      }).catch((err) => {
        throw new KintoneExeption(err);
      });
  }
  /**
     * upload file to kintone
     * @param {JSONObjectg} formData
     * @return {Promise}
     */
  upload(formData) {
    return connection.get(this)
      .addRequestOption('formData', formData)
      .request('POST', 'FILE', null)
      .then((result) => {
        return result;
      }).catch((err) => {
        throw new KintoneExeption(err);
      });
  }
}
module.exports = File;
