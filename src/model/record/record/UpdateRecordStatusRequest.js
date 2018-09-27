const UpdateRecordStatusItem = require('./UpdateRecordStatusItem');

/**
 * UpdateRecordStatusRequest model
 */
class UpdateRecordStatusRequest extends UpdateRecordStatusItem {
  /**
     * constructor
     * @param {String} appID
     * @param {String} recordID
     * @param {String} actionName
     * @param {String} assigneeID
     * @param {String} revisionID
     */
  constructor(appID, recordID, actionName, assigneeID, revisionID) {
    super(recordID, actionName, assigneeID, revisionID);
    this.appID = appID;
  }
  /**
     * Get JSON struct of this model
     * @return {integer}
     */
  toJSON() {
    const data = super.toJSON();
    data.app = this.appID;
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
module.exports = UpdateRecordStatusRequest;
