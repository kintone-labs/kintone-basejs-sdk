/**
 * kintone api - nodejs client
 */

const appID = new WeakMap();
const recordID = new WeakMap();
const assignees = new WeakMap();
const revision = new WeakMap();

/**
 * UpdateRecordAssigneesRequest model
 */
class UpdateRecordAssigneesRequest {
  /**
     * constructor
     * @param {String} appIDInput
     * @param {String} recordIDInput
     * @param {Array<String>} assigneesIDInput
     * @param {String} revisionIDInput
     */
  constructor(appIDInput, recordIDInput, assigneesIDInput, revisionIDInput) {
    appID.set(this, appIDInput);
    recordID.set(this, recordIDInput);
    assignees.set(this, assigneesIDInput);
    revision.set(this, revisionIDInput);
  }
  /**
     * Get JSON struct of this model
     * @return {integer}
     */
  toJSON() {
    return {
      app: appID.get(this),
      id: recordID.get(this),
      assignees: assignees.get(this),
      revision: revision.get(this) || null,
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
module.exports = UpdateRecordAssigneesRequest;
