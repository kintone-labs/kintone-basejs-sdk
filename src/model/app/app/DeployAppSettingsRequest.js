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
     * @param {Array} apps
     * @param {HashTable<String, FieldValue>} recordHashTableData
     */
  constructor(apps, revert) {
    kintonePreviewApps.set(this, apps);
    kintoneRevert.set(this, revert);
  }
  /**
     * Get apps
     * @return {Array}
     */
  getApps() {
    return kintonePreviewApps.get(this);
  }
  /**
     * @param {Array<AddPreviewAppResponse>} apps
     * @return {this} AddRecoDeployAppSettingsRequestrdsRequest
     */
  setApps(apps) {
    return kintonePreviewApps.set(this, apps);
  }
  /**
     * Get reviert
     * @return {Boolean}
     */
  getRevert() {
    return kintoneRevert.get(this);
  }
  /**
     * @param {Boolean>} revert
     * @return {this} AddRecoDeployAppSettingsRequestrdsRequest
     */
  setRevert(revert) {
    return kintoneRevert.set(this, revert);
  }
  /**
     * Get JSON struct of this model
     * @return {JSON}
     */
  toJSON() {
    return {
      apps: this.getApps(),
      revert: this.getRevert()
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
