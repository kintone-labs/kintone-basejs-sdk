const KintoneAPIException = require('../../exception/KintoneAPIException');
const Connection = require('../../connection/Connection');
const BulkRequestModel = require('../../model/bulkRequest/BulkRequest');
const BulkRequestItemModel = require('../../model/bulkRequest/BulkRequestItem');
const RecordModel = require('../../model/record/RecordModels');

/**
 * BulkRequest module
 */
class BulkRequest {
  /**
     * Constructor function of BulkRequest
     * @param {Connection} connection
     */
  constructor(connection) {
    if (!(connection instanceof Connection)) {
      throw new Error(`${connection} not an instance of Connection`);
    }
    this.connection = connection;
    this.bulkRequests = new BulkRequestModel();
  }

  /**
     * Add the record
     * @param {Integer} app
     * @param {Record} record
     * @return {this}
     */
  addRecord(app, record) {
    const addRecordRequest = new RecordModel.AddRecordRequest(app, record);
    const bulkRequestItem = new BulkRequestItemModel('POST', this.connection.getPathURI('RECORD'), addRecordRequest);
    this.bulkRequests.addRequest(bulkRequestItem);
    return this;
  }

  /**
     * Add multi records
     * @param {Integer} app
     * @param {Array<record>} records
     * @return {this}
     */
  addRecords(app, records) {
    const addRecordsRequest = new RecordModel.AddRecordsRequest(app);
    addRecordsRequest.setRecords(records);

    const bulkRequestItem = new BulkRequestItemModel('POST', this.connection.getPathURI('RECORDS'), addRecordsRequest);
    this.bulkRequests.addRequest(bulkRequestItem);
    return this;
  }

  /**
     * Update the specific record by ID
     * @param {Integer} app
     * @param {Integer} id
     * @param {Record} record
     * @param {Integer} revision
     * @return {this}
     */
  updateRecordByID(app, id, record, revision) {
    const updateRecordRequest = new RecordModel.UpdateRecordRequest(app);
    updateRecordRequest.setID(id).setRecord(record).setRevision(revision || 0);

    const bulkRequestItem = new BulkRequestItemModel('PUT', this.connection.getPathURI('RECORD'), updateRecordRequest);
    this.bulkRequests.addRequest(bulkRequestItem);
    return this;
  }

  /**
     * Update the specific record by updateKey
     * @param {Integer} app
     * @param {RecordUpdateKey} updateKey
     * @param {Record} record
     * @param {Integer} revision
     * @return {this}
     */
  updateRecordByUpdateKey(app, updateKey, record, revision) {
    const updateRecordRequest = new RecordModel.UpdateRecordRequest(app);
    updateRecordRequest.setUpdateKey(updateKey.field, updateKey.value).setRecord(record).setRevision(revision || 0);

    const bulkRequestItem = new BulkRequestItemModel('PUT', this.connection.getPathURI('RECORD'), updateRecordRequest);
    this.bulkRequests.addRequest(bulkRequestItem);
    return this;
  }

  /**
     * Update multi records
     * @param {Integer} app
     * @param {Array<RecordUpdateItem>} records
     * @return {this}
     */
  updateRecords(app, records) {
    const updateRecordsRequest = new RecordModel.UpdateRecordsRequest(app, records);
    const bulkRequestItem = new BulkRequestItemModel('PUT', this.connection.getPathURI('RECORDS'), updateRecordsRequest);
    this.bulkRequests.addRequest(bulkRequestItem);
    return this;
  }

  /**
     * Delete multi records
     * @param {Integer} app
     * @param {Array<Integer>} ids
     * @return {this}
     */
  deleteRecords(app, ids) {
    const deleteRecordsRequest = new RecordModel.DeleteRecordsRequest(app);
    deleteRecordsRequest.setIDs(ids);

    const bulkRequestItem = new BulkRequestItemModel('DELETE', this.connection.getPathURI('RECORDS'), deleteRecordsRequest);
    this.bulkRequests.addRequest(bulkRequestItem);
    return this;
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

    const bulkRequestItem = new BulkRequestItemModel('DELETE', this.connection.getPathURI('RECORDS'), deleteRecordsRequest);
    this.bulkRequests.addRequest(bulkRequestItem);
    return this;
  }

  /**
     * Update assignees of the specific record
     * @param {*} app
     * @param {*} record
     * @param {Array<String>} assignees
     * @param {Integer} revision
     * @return {this}
     */
  updateRecordAssignees(app, record, assignees, revision) {
    const updateRecordRequest = new RecordModel.UpdateRecordAssigneesRequest(app, record, assignees, revision);
    const bulkRequestItem = new BulkRequestItemModel('PUT', this.connection.getPathURI('RECORD_ASSIGNEES'), updateRecordRequest);
    this.bulkRequests.addRequest(bulkRequestItem);
    return this;
  }

  /**
     * Update status of the specific record
     * @param {Integer} app
     * @param {Integer} id
     * @param {String} action
     * @param {String} assignee
     * @param {Integer} revision
     * @return {this}
     */
  updateRecordStatus(app, id, action, assignee, revision) {
    const updateRecordRequest = new RecordModel.UpdateRecordStatusRequest(app, id, action, assignee, revision);
    const bulkRequestItem = new BulkRequestItemModel('PUT', this.connection.getPathURI('RECORD_STATUS'), updateRecordRequest);
    this.bulkRequests.addRequest(bulkRequestItem);
    return this;
  }

  /**
     * Update status of the multi records
     * @param {Integer} app
     * @param {Array<RecordStatusUpdate>} recordsStatusUpdate
     * @return {this}
     */
  updateRecordsStatus(app, records) {
    const updateRecordsRequest = new RecordModel.UpdateRecordsRequest(app, records);
    const bulkRequestItem = new BulkRequestItemModel('PUT', this.connection.getPathURI('RECORDS_STATUS'), updateRecordsRequest);
    this.bulkRequests.addRequest(bulkRequestItem);
    return this;
  }

  /**
     * Execute the BulkRequest and get data which is returned from kintone.
     * @return {promise}
     */
  execute() {
    return this.connection.addRequestOption('json', true)
      .request('POST', 'BULK_REQUEST', this.bulkRequests.toJSON())
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw new KintoneAPIException(err);
      });
  }
}
module.exports = BulkRequest;
