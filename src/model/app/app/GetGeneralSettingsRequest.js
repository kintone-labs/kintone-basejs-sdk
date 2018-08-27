/**
 * kintone api - nodejs client
 */

const kintoneApp = new WeakMap();
const kintoneLang = new WeakMap();

/**
 * GetGeneralSettingsRequest model
 * TODO: Unit testing
 */
class GetGeneralSettingsRequest {
  /**
     * @param {Integer} app
     * @param {String} lang
     */
  constructor(app, lang) {
    kintoneApp.set(this, app);
    kintoneLang.set(this, lang);
  }
  /**
         * Get JSON struct of this model
         * @return {JSON}
         */
  toJSON() {
    const data = {
      app: kintoneApp.get(this),
      lang: kintoneLang.get(this)
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
module.exports = GetGeneralSettingsRequest;
