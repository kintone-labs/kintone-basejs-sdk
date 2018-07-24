/**
 * kintone api - nodejs client
 * App module
 */

const KintoneExeption = require('../../exception/kintoneException');
const KintoneConnection = require('../../connection/connection');
const AppModel = require('../../model/app/appModel');

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
  getDataBy(method, url, model) {
    const body = model.toJSON ? model.toJSON() : model;
    return connection.get(this)
      .addRequestOption('json', true)
      .request(method, url, body)
      .then((result) => {
        return result;
      }).catch((err) => {
        throw new KintoneExeption(err);
      });
  }
  /**
     * Get single app details
     * @param {Integer} appID
     * @return {Promise} Promise
     */
  getApp(appID) {
    const dataRequest =
            new AppModel.GetAppRequest(appID);
    return this.getDataBy('GET', 'app', dataRequest);
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
    return this.getDataBy('GET', 'apps', dataRequest);
  }
  /**
     * Get multiple apps details
     * @param {Array<String>} appCodes
     * @param {Integer} offset
     * @param {Integer} limit
     * @return {Promise} Promise
     */
  getAppsByCodes(appCodes, offset, limit) {
    const dataRequest =
            new AppModel.GetAppsRequest(offset, limit);
    dataRequest.setAppCodes(appCodes);
    return this.getDataBy('GET', 'apps', dataRequest);
  }
  /**
     * Get multiple apps details
     * @param {String} appName
     * @param {Integer} offset
     * @param {Integer} limit
     * @return {Promise} Promise
     */
  getAppsByName(appName, offset, limit) {
    const dataRequest =
            new AppModel.GetAppsRequest(offset, limit);
    dataRequest.setAppName(appName);
    return this.getDataBy('GET', 'apps', dataRequest);
  }
  /**
     * Get multiple apps details
     * @param {Array<Integer>} appIDs
     * @param {Integer} offset
     * @param {Integer} limit
     * @return {Promise} Promise
     */
  getAppsByIDs(appIDs, offset, limit) {
    const dataRequest =
            new AppModel.GetAppsRequest(offset, limit);
    dataRequest.setAppIDs(appIDs);
    return this.getDataBy('GET', 'apps', dataRequest);
  }
  /**
     * Get multiple apps details
     * @param {Array<String>} appSpaceIDs
     * @param {Integer} offset
     * @param {Integer} limit
     * @return {Promise} Promise
     */
  getAppsBySpaceIDs(appSpaceIDs, offset, limit) {
    const dataRequest =
            new AppModel.GetAppsRequest(offset, limit);
    dataRequest.setAppSpaceIDs(appSpaceIDs);
    return this.getDataBy('GET', 'apps', dataRequest);
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
    return this.getDataBy('GET', apiName, dataRequest);
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
    return this.getDataBy('GET', apiName, dataRequest);
  }
}
module.exports = App;
