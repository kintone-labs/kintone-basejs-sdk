/**
 * kintone api - nodejs client
 */

const kintoneApp = new WeakMap();
const kintoneFields = new WeakMap();
const kintoneRevision = new WeakMap();

/**
 * UpdateFormFieldsRequest model
 * TODO: Unit testing
 */
class UpdateFormFieldsRequest {
  /**
     * @param {Integer} app
     * @param {Array<HashTable<String, Field>>} fields
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
      properties: kintoneFields.get(this),
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
module.exports = UpdateFormFieldsRequest;
