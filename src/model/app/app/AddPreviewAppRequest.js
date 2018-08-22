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
module.exports = AddPreviewAppRequest;
