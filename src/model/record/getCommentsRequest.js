/**
 * kintone api - nodejs client
 */

const appID = new WeakMap();
const recordID = new WeakMap();
const order = new WeakMap();
const offset = new WeakMap();
const limit = new WeakMap();

/**
 * GetCommentRequest model
 */
class GetCommentRequest {
  /**
     * constructor
     * @param {Initeger} appIDInput
     * @param {Initeger} recordIDInput
     * @param {String} orderInput
     * @param {Integer} offsetInput
     * @param {Integer} limitInput
     */
  constructor(
    appIDInput, recordIDInput, orderInput, offsetInput, limitInput) {
    appID.set(this, appIDInput);
    recordID.set(this, recordIDInput);
    order.set(this, orderInput);
    offset.set(this, offsetInput);
    limit.set(this, limitInput);
  }
  /**
     * Get JSON struct of this model
     * @return {integer}
     */
  toJSON() {
    return {
      app: appID.get(this),
      record: recordID.get(this),
      order: order.get(this),
      offset: offset.get(this),
      limit: limit.get(this),
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
module.exports = GetCommentRequest;
