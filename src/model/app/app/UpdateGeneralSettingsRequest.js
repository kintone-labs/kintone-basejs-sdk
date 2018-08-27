/**
 * kintone api - nodejs client
 */

const kintoneApp = new WeakMap();
const kintoneGeneralSettings = new WeakMap();
const kintoneRevision = new WeakMap();

/**
 * UpdateGeneralSettingsRequest model
 * TODO: Unit testing
 */
class UpdateGeneralSettingsRequest {
  /**
     * @param {Integer} app
     * @param {GeneralSettings } generalSettings
     * @param {Integer} revision
     */
  constructor(app, generalSettings, revision) {
    kintoneApp.set(this, app);
    kintoneGeneralSettings.set(this, generalSettings);
    kintoneRevision.set(this, revision);
  }
  /**
     * Get JSON struct of this model
     * @return {JSON}
     */
  toJSON() {
    const data = kintoneGeneralSettings.get(this);
    data.app = kintoneApp.get(this);
    data.revision = kintoneRevision.get(this);
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
module.exports = UpdateGeneralSettingsRequest;
