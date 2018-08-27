/**
 * kintone api - nodejs client
 */

const kintoneApp = new WeakMap();
const kintoneFields = new WeakMap();
const kintoneRevision = new WeakMap();

/**
 * DeleteFormFieldsRequest model
 * TODO: Unit testing
 */
class DeleteFormFieldsRequest {
  /**
     * @param {Integer} app
     * @param {Array<String>} fields
     * @param {Integer} revision
     */
  constructor(app, fields, revision) {
    kintoneApp.set(this, app);
    kintoneFields.set(this, fields);
    kintoneRevision.set(this, revision);
  }
  /**
     * Get JSON struct of this model
     * @return {JSON}
     */
  toJSON() {
    const data = {
      app: kintoneApp.get(this),
      fields: kintoneFields.get(this),
      revision: kintoneRevision.get(this)

    };
    return data;
  }
  /**
     * Convert this model to JSON string
     * @return {String}
     */
  toJSONString() {
    return JSON.stringify(this.toJSON());
  }
}
module.exports = DeleteFormFieldsRequest;
