/**
 * kintone api - nodejs client
 */

const kintoneApp = new WeakMap();
const kintoneLayout = new WeakMap();
const kintoneRevision = new WeakMap();

/**
 * UpdateFormLayoutRequest model
 * TODO: Unit testing
 */
class UpdateFormLayoutRequest {
  /**
     * @param {Integer} app
     * @param {Array<HashTable<String, Field>>} fields
     * @param {Integer} revision
     */
  constructor(app, fields, revision) {
    kintoneApp.set(this, app);
    kintoneLayout.set(this, fields);
    kintoneRevision.set(this, revision);
  }
  /**
     * Get JSON struct of this model
     * @return {JSON}
     */
  toJSON() {
    const data = {
      app: kintoneApp.get(this),
      layout: kintoneLayout.get(this),
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
module.exports = UpdateFormLayoutRequest;
