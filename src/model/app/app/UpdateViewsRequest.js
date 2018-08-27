/**
 * kintone api - nodejs client
 */

const kintoneApp = new WeakMap();
const kintoneViews = new WeakMap();
const kintoneRevision = new WeakMap();

/**
 * UpdateViewsRequest model
 * TODO: Unit testing
 */
class UpdateViewsRequest {
  /**
     * @param {Integer} app
     * @param {<HashTable<String, View>} views
     * @param {Integer} revision
     */
  constructor(app, views, revision) {
    kintoneApp.set(this, app);
    kintoneViews.set(this, views);
    kintoneRevision.set(this, revision);
  }
  /**
     * Get JSON struct of this model
     * @return {JSON}
     */
  toJSON() {
    const data = {
      app: kintoneApp.get(this),
      views: kintoneViews.get(this),
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
module.exports = UpdateViewsRequest;
