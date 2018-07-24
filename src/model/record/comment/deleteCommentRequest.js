/**
 * kintone api - nodejs client
 */

const appID = new WeakMap();
const recordID = new WeakMap();
const commentID = new WeakMap();

/**
 * DeleteCommentRequest model
 */
class DeleteCommentRequest {
  /**
     * constructor
     * @param {Initeger} appIDInput
     * @param {Initeger} recordIDInput
     * @param {String} commentIDInput
     */
  constructor(appIDInput, recordIDInput, commentIDInput) {
    appID.set(this, appIDInput);
    recordID.set(this, recordIDInput);
    commentID.set(this, commentIDInput);
  }
  /**
     * Get JSON struct of this model
     * @return {integer}
     */
  toJSON() {
    return {
      app: appID.get(this),
      record: recordID.get(this),
      comment: commentID.get(this),
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
module.exports = DeleteCommentRequest;
