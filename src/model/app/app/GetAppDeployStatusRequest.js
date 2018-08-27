/**
 * kintone api - nodejs client
 */

const kintoneApps = new WeakMap();

/**
 * GetAppDeployStatusRequest model
 * TODO: Unit testing
 */
class GetAppDeployStatusRequest {
  /**
     * @param {Array} apps
     * @param {Array<HashTable<String, Field>>} fields
     * @param {Integer} revision
     */
  constructor(apps) {
    kintoneApps.set(this, apps);
  }
  /**
     * Get JSON struct of this model
     * @return {JSON}
     */
  toJSON() {
    const data = {
      apps: kintoneApps.get(this)
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
module.exports = GetAppDeployStatusRequest;
