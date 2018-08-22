/**
 * kintone api - nodejs client
 * DeployAppSettingsRequest model
 */

const kintonePreviewApps = new WeakMap();
const kintoneRevert = new WeakMap();
/**
 * DeployAppSettingsRequest model
 */
class DeployAppSettingsRequest {
  /**
     * constructor for DeployAppSettingsRequest
     * @param {integer} appID
     * @param {HashTable<String, FieldValue>} recordHashTableData
     */
  constructor(apps, revert) {
    kintonePreviewApps.set(this, apps);
    kintoneRevert.set(this, revert);
  }
  /**
     * Get app name
     * @return {integer}
     */
  getAppName() {
    return kintoneAppName.get(this);
  }
  /**
     * Get space of app
     * @return {HashTable<String, FieldValue>}
     */
  getSpace() {
    return kintoneSpace.get(this);
  }
  /**
     * Get thread
     * @return {HashTable<String, FieldValue>}
     */
  getThread() {
    return kintoneThread.get(this);
  }
  /**
     * Get JSON struct of this model
     * @return {JSON}
     */
  toJSON() {
    return {
      name: this.getAppName(),
      space: this.getSpace(),
      thread: this.getThread(),
    };
  }
  /**
     * Convert this model to JSON string
     * @return {String}
     */
  toJSONString() {
    return JSON.stringify(this.toJSON());
  }
}
module.exports = DeployAppSettingsRequest;
