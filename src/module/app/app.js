/**
 * kintone api - nodejs client
 * App module
 */

const KintoneExeption = require('../../exception/KintoneAPIException');
const KintoneConnection = require('../../connection/Connection');
const AppModel = require('../../model/app/AppModel');

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
     * @param {Array<String>} codes
     * @param {Integer} offset
     * @param {Integer} limit
     * @return {Promise} Promise
     */
  getAppsByCodes(codes, offset, limit) {
    const dataRequest =
            new AppModel.GetAppsRequest(offset, limit);
    dataRequest.setAppCodes(codes);
    return this.getDataBy('GET', 'apps', dataRequest);
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
    return this.getDataBy('GET', 'apps', dataRequest);
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
    return this.getDataBy('GET', 'apps', dataRequest);
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
