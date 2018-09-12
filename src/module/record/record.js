const Connection = require('../../connection/Connection');
const RecordModel = require('../../model/record/RecordModels');
const common = require('../../utils/Common');

/**
 * Record module
 */
class Record {
  /**
     * The constructor for Record module
     * @param {Connection} connection
     */
  constructor(connection) {
    if (!(connection instanceof Connection)) {
      throw new Error(`${connection} not an instance of Connection`);
    }
    this.connection = connection;
  }

  /**
     * @param {String} method
     * @param {String} url
     * @param {RecordModle} model
     * @return {Promise} Promise
     */
  sendRequest(method, url, model) {
    return common.sendRequest(method, url, model, this.connection);
  }
  /**
     * Get record by specific ID
     * TODO: Parse to response model
     * @param {Integer} app
     * @param {Integer} id
     * @return {Promise} Promise
     */
  getRecord(app, id) {
    const getRecordRequest = new RecordModel.GetRecordRequest(app, id);
    return this.sendRequest('GET', 'record', getRecordRequest);
  }
  /**
     * Get multi record with options
     * TODO: Parse to response model
     * @param {Integer} app
     * @param {String} query
     * @param {Array<String>} fields
     * @param {Boolean} totalCount
     * @return {Promise} Promise
     */
  getRecords(app, query, fields, totalCount) {
    const getRecordsRequest = new RecordModel.GetRecordsRequest(app, query, fields, totalCount);
    return this.sendRequest('GET', 'records', getRecordsRequest);
  }
  /**
     * Add the record
     * @param {Integer} app
     * @param {Record} record
     * @return {Promise} Promise
     */
  addRecord(app, record) {
    const addRecordRequest = new RecordModel.AddRecordRequest(app, record);
    return this.sendRequest('POST', 'record', addRecordRequest);
  }

  /**
     * Add multi records
     * @param {Integer} app
     * @param {Array<record>} records
     * @return {Promise} Promise
     */
  addRecords(app, records) {
    const addRecordsRequest = new RecordModel.AddRecordsRequest(app);
    addRecordsRequest.setRecords(records);
    return this.sendRequest('POST', 'records', addRecordsRequest);
  }

  /**
     * Update the specific record by ID
     * @param {Integer} app
     * @param {Integer} id
     * @param {Record} record
     * @param {Integer} revision
     * @return {Promise} Promise
     */
  updateRecordByID(app, id, record, revision) {
    const updateRecordRequest = new RecordModel.UpdateRecordRequest(app);

    updateRecordRequest
      .setID(id)
      .setRecord(record)
      .setRevision(revision || 0);

    return this.sendRequest('PUT', 'record', updateRecordRequest);
  }


  /**
     * Update the specific record by updateKey
     * @param {Integer} app
     * @param {RecordUpdateKey} updateKey
     * @param {Record} record
     * @param {Integer} revision
     * @return {Promise} Promise
     */
  updateRecordByUpdateKey(app, updateKey, record, revision) {
    const updateRecordRequest = new RecordModel.UpdateRecordRequest(app);

    updateRecordRequest
      .setUpdateKey(updateKey.field, updateKey.value)
      .setRecord(record)
      .setRevision(revision || 0);

    return this.sendRequest('PUT', 'record', updateRecordRequest);
  }
  /**
     * create record Item With id, use to update multi Record
     * @param {*} id
     * @param {*} recordData
     * @param {*} revision
     * @return {RecordsUpdateItem}
     */
  createRecordItemWithID(id, recordData, revision) {
    return new RecordModel.RecordsUpdateItem()
      .setID(id)
      .setRecord(recordData)
      .setRevision(revision || 0);
  }
  /**
     * create record Item With UpdateKey, use to update multi Record
     * @param {*} updateKey
     * @param {*} recordData
     * @param {*} revision
     * @return {RecordsUpdateItem}
     */
  createRecordItemWithUpdateKey(updateKey, recordData, revision) {
    return new RecordModel.RecordsUpdateItem()
      .setUpdateKey(updateKey.field, updateKey.value)
      .setRecord(recordData)
      .setRevision(revision || 0);
  }
  /**
     * Update multi records
     * @param {Integer} app
     * @param {Array<RecordUpdateItem>} records
     * @return {Promise} Promise
     */
  updateRecords(app, records) {
    const updateRecordsRequest = new RecordModel.UpdateRecordsRequest(app, records);

    return this.sendRequest('PUT', 'records', updateRecordsRequest);
  }

  /**
     * Delete multi records
     * @param {Integer} app
     * @param {Array<Integer>} ids
     * @return {Promise} Promise
     */
  deleteRecords(app, ids) {
    const deleteRecordsRequest = new RecordModel.DeleteRecordsRequest(app);
    deleteRecordsRequest.setIDs(ids);
    return this.sendRequest('DELETE', 'records', deleteRecordsRequest);
  }

  /**
     * Delete records at the specific revision
     * @param {Integer} app
     * @param {HashTable <Integer, Integer>} idsWithRevision
     * @return {this}
     */
  deleteRecordsWithRevision(app, idsWithRevision) {
    const deleteRecordsRequest = new RecordModel.DeleteRecordsRequest(app);
    deleteRecordsRequest.setIDsWithRevision(idsWithRevision);

    return this.sendRequest('DELETE', 'records', deleteRecordsRequest);
  }

  /**
     * Update assignees of the specific record
     * @param {*} app
     * @param {*} id
     * @param {Array<String>} assignees
     * @param {Integer} revision
     * @return {Promise}
     */
  updateRecordAssignees(app, id, assignees, revision) {
    const updateRecordRequest = new RecordModel.UpdateRecordAssigneesRequest(app, id, assignees, revision);

    return this.sendRequest('PUT', 'RECORD_ASSIGNEES', updateRecordRequest);
  }

  /**
     * Update status of the specific record
     * @param {Integer} app
     * @param {Integer} id
     * @param {String} action
     * @param {String} assignee
     * @param {Integer} revision
     * @return {Promise}
     */
  updateRecordStatus(app, id, action, assignee, revision) {
    const updateRecordRequest = new RecordModel.UpdateRecordStatusRequest(app, id, action, assignee, revision);

    return this.sendRequest('PUT', 'RECORD_STATUS', updateRecordRequest);
  }

  /**
     * Update status of the multi records
     * @param {Integer} app
     * @param {Array <RecordStatusUpdate>} records
     * @return {Promise}
     */
  updateRecordsStatus(app, records) {
    const updateRecordsRequest = new RecordModel.UpdateRecordsRequest(app, records);

    return this.sendRequest('PUT', 'RECORDS_STATUS', updateRecordsRequest);
  }
  /**
     * createRecordStatusItem for use with update multi record status
     * @param {Integer} recordIDInput
     * @param {String} actionNameInput
     * @param {String} assigneeIDInput
     * @param {String} revisionIDInput
     * @return {RecordsUpdateStatusItem}
     */
  createRecordStatusItem(recordIDInput, actionNameInput,
    assigneeIDInput, revisionIDInput) {
    return new RecordModel.RecordsUpdateStatusItem(recordIDInput, actionNameInput, assigneeIDInput, revisionIDInput);
  }
  /**
     * Get comments of the specific record
     * @param {Integer} app
     * @param {Integer} record
     * @param {string} order  {asc|desc}
     * @param {Integer} offset
     * @param {Integer} limit
     * @return {Promise}
     */
  getComments(app, record, order, offset, limit) {
    const getCommentsRequest = new RecordModel.GetCommentsRequest(app, record, order, offset, limit);
    return this.sendRequest('GET', 'RECORD_COMMENTS', getCommentsRequest);
  }

  /**
     * Add new comment to the specific record
     * @param {Integer} app
     * @param {Integer} record
     * @param {CommentContent} comment
     * @return {Promise}
     */
  addComment(app, record, comment) {
    const addCommentRequest = new RecordModel.AddCommentRequest(app, record, comment);
    return this.sendRequest('POST', 'RECORD_COMMENT', addCommentRequest);
  }

  /**
     *
     * @param {Integer} app
     * @param {Integer} record
     * @param {Integer} comment
     * @return {Promise}
     */
  deleteComment(app, record, comment) {
    const deleteCommentRequest = new RecordModel.DeleteCommentRequest(app, record, comment);
    return this.sendRequest('DELETE', 'RECORD_COMMENT', deleteCommentRequest);
  }
}
module.exports = Record;
