/**
 * DeleteCommentRequest model
 */
class DeleteCommentRequest {
  /**
     * constructor
     * @param {Initeger} appID
     * @param {Initeger} recordID
     * @param {Initeger} commentID
     */
  constructor(appID, recordID, commentID) {
    this.appID = appID;
    this.recordID = recordID;
    this.commentID = commentID;
  }
  /**
     * Get JSON struct of this model
     * @return {integer}
     */
  toJSON() {
    return {
      app: this.appID,
      record: this.recordID,
      comment: this.commentID
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
