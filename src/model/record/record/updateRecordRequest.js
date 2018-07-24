/**
 * kintone api - nodejs client
 */

const RecordUpdateItem = require('./RecordUpdateItem');

const app = new WeakMap();

/**
 * UpdateRecordRequest model
 */
class UpdateRecordRequest extends RecordUpdateItem {
  /**
     * @param {String} appIDInput
     */
  constructor(appIDInput) {
    super();
    app.set(this, appIDInput);
  }
  /**
     * Get JSON struct of this model
     * @return {JSON}
     */
  toJSON() {
    const data = super.toJSON();
    data.app = app.get(this);
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
module.exports = UpdateRecordRequest;
