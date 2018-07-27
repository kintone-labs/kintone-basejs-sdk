/**
 * kintone api - nodejs client
 * App module
 */

const KintoneConnection = require('../../connection/Connection');
const AppModel = require('../../model/app/AppModel');
const common = require('../../utils/Common');

const connection = new WeakMap();

/**
 * App module
 */
class App {
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
     * @param {String} method
     * @param {String} url
     * @param {RecordModle} model
     * @return {Promise} Promise
     */
  sendRequest(method, url, model) {
    return common.sendRequest(method, url, model, connection.get(this));
  }
  /**
     * Get single app details
     * @param {Integer} appID
     * @return {Promise} Promise
     */
  getApp(appID) {
    const dataRequest =
            new AppModel.GetAppRequest(appID);
    return this.sendRequest('GET', 'app', dataRequest);
  }
  /**
     * Get multiple apps details
     * @param {Integer} offset
     * @param {Integer} limit
     * @return {Promise} Promise
     */
  getApps(offset, limit) {
    const dataRequest =
            new AppModel.GetAppsRequest(offset, limit);
    return this.sendRequest('GET', 'apps', dataRequest);
  }
  /**
     * Get multiple apps details
     * @param {Array<String>} codes
     * @param {Integer} offset
     * @param {Integer} limit
     * @return {Promise} Promise
     */
  getAppsByCodes(codes, offset, limit) {
    const dataRequest =
            new AppModel.GetAppsRequest(offset, limit);
    dataRequest.setAppCodes(codes);
    return this.sendRequest('GET', 'apps', dataRequest);
  }
  /**
     * Get multiple apps details
     * @param {String} name
     * @param {Integer} offset
     * @param {Integer} limit
     * @return {Promise} Promise
     */
  getAppsByName(name, offset, limit) {
    const dataRequest =
            new AppModel.GetAppsRequest(offset, limit);
    dataRequest.setAppName(name);
    return this.sendRequest('GET', 'apps', dataRequest);
  }
  /**
     * Get multiple apps details
     * @param {Array<Integer>} ids
     * @param {Integer} offset
     * @param {Integer} limit
     * @return {Promise} Promise
     */
  getAppsByIDs(ids, offset, limit) {
    const dataRequest =
            new AppModel.GetAppsRequest(offset, limit);
    dataRequest.setAppIDs(ids);
    return this.sendRequest('GET', 'apps', dataRequest);
  }
  /**
     * Get multiple apps details
     * @param {Array<String>} spaceIds
     * @param {Integer} offset
     * @param {Integer} limit
     * @return {Promise} Promise
     */
  getAppsBySpaceIDs(spaceIds, offset, limit) {
    const dataRequest =
            new AppModel.GetAppsRequest(offset, limit);
    dataRequest.setAppSpaceIDs(spaceIds);
    return this.sendRequest('GET', 'apps', dataRequest);
  }
  /**
     * Get app's form fields details
     * @param {Integer} appID
     * @param {String} lang
     * @param {Boolean} isPreview
     * @return {Promise} Promise
     */
  getFormFields(appID, lang, isPreview) {
    const dataRequest =
            new AppModel.GetFormFieldsRequest(appID, lang);
    const apiName = isPreview === true ? 'APP_FIELDS_PREVIEW' : 'APP_FIELDS';
    return this.sendRequest('GET', apiName, dataRequest);
  }
  /**
     * Get app's form fields details
     * @param {Integer} appID
     * @param {Boolean} isPreview
     * @return {Promise} Promise
     */
  getFormLayout(appID, isPreview) {
    const dataRequest =
            new AppModel.GetFormLayoutsRequest(appID);
    const apiName = isPreview === true ? 'APP_LAYOUT_PREVIEW' : 'APP_LAYOUT';
    return this.sendRequest('GET', apiName, dataRequest);
  }
}
module.exports = App;
