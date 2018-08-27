/**
 * kintone api - nodejs client
 * AddPreviewAppRequest model
 */

const kintoneAppName = new WeakMap();
const kintoneSpace = new WeakMap();
const kintoneThread = new WeakMap();
/**
 * AddPreviewAppRequest model
 */
class AddPreviewAppRequest {
  /**
     * constructor for AddPreviewAppRequest
     * @param {integer} appID
     * @param {HashTable<String, FieldValue>} recordHashTableData
     */
  constructor(name, space, thread) {
    kintoneAppName.set(this, name);
    kintoneSpace.set(this, space);
    kintoneThread.set(this, thread);
  }
  /**
     * Get app name
     * @return {String}
     */
  getAppName() {
    return kintoneAppName.get(this);
  }
  /**
     * Set app name
     * @return {this} AddPreviewAppRequest
     */
  setAppName(name) {
    kintoneAppName.set(this, name);
    return this;
  }
  /**
     * Get space of app
     * @return {String}
     */
  getSpace() {
    return kintoneSpace.get(this);
  }
  /**
     * Set space of app
     * @return {this} AddPreviewAppRequest
     */
  setSpace(space) {
    kintoneSpace.set(this, space);
    return this;
  }
  /**
     * Get thread
     * @return {String}
     */
  getThread() {
    return kintoneThread.get(this);
  }
  /**
     * Set Thread of app
     * @return {this} AddPreviewAppRequest
     */
  setThread(thread) {
    kintoneThread.set(this, thread);
    return this;
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
module.exports = AddPreviewAppRequest;
