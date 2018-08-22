/**
 * kintone api - nodejs client
 */

const KintoneExeption = require('../../exception/KintoneAPIException');
const KintoneConnection = require('../../connection/Connection');
const BulkRequestModel = require('../../model/bulkRequest/BulkRequest');
const BulkRequestItemModel = require('../../model/bulkRequest/BulkRequestItem');
const RecordModel = require('../../model/record/RecordModels');

const kintoneConnection = new WeakMap();
const bulkRequests = new WeakMap();
/**
 * BulkRequest module
 */
class BulkRequest {
  /**
     * Constructor function of BulkRequest
     * @param {Connection} connection
     */
  constructor(connection) {
    if (!(connection instanceof KintoneConnection)) {
      throw new Error(`${connection} \
                not an instance of KintoneConnection`);
    }
    kintoneConnection.set(this, connection);
    bulkRequests.set(this, new BulkRequestModel());
  }

  /**
     * Add the record
     * @param {Integer} app
     * @param {Record} record
     * @return {this}
     */
  addRecord(app, record) {
    const addRecordRequest =
            new RecordModel.AddRecordRequest(app, record);
    const bulkRequestItem = new BulkRequestItemModel(
      'POST',
      kintoneConnection.get(this).getPathURI('RECORD'),
      addRecordRequest
    );
    bulkRequests.get(this).addRequest(bulkRequestItem);
    return this;
  }

  /**
     * Add multi records
     * @param {Integer} app
     * @param {Array<record>} records
     * @return {this}
     */
  addRecords(app, records) {
    const addRecordsRequest =
            new RecordModel.AddRecordsRequest(app);
    addRecordsRequest.setRecords(records);

    const bulkRequestItem = new BulkRequestItemModel(
      'POST',
      kintoneConnection.get(this).getPathURI('RECORDS'),
      addRecordsRequest
    );
    bulkRequests.get(this).addRequest(bulkRequestItem);
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
    const updateRecordRequest =
            new RecordModel.UpdateRecordRequest(app);
    updateRecordRequest
      .setID(id)
      .setRecord(record)
      .setRevision(revision || 0);

    const bulkRequestItem = new BulkRequestItemModel(
      'PUT',
      kintoneConnection.get(this).getPathURI('RECORD'),
      updateRecordRequest
    );
    bulkRequests.get(this).addRequest(bulkRequestItem);
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
    const updateRecordRequest =
            new RecordModel.UpdateRecordRequest(app);
    updateRecordRequest
      .setUpdateKey(updateKey.field, updateKey.value)
      .setRecord(record)
      .setRevision(revision || 0);

    const bulkRequestItem = new BulkRequestItemModel(
      'PUT',
      kintoneConnection.get(this).getPathURI('RECORD'),
      updateRecordRequest
    );
    bulkRequests.get(this).addRequest(bulkRequestItem);
    return this;
  }

  /**
     * Update multi records
     * @param {Integer} app
     * @param {Array<RecordUpdateItem>} records
     * @return {this}
     */
  updateRecords(app, records) {
    const updateRecordsRequest =
            new RecordModel.UpdateRecordsRequest(app, records);

    const bulkRequestItem = new BulkRequestItemModel(
      'PUT',
      kintoneConnection.get(this).getPathURI('RECORDS'),
      updateRecordsRequest
    );
    bulkRequests.get(this).addRequest(bulkRequestItem);
    return this;
  }

  /**
     * Delete multi records
     * @param {Integer} app
     * @param {Array<Integer>} ids
     * @return {this}
     */
  deleteRecords(app, ids) {
    const deleteRecordsRequest =
            new RecordModel.DeleteRecordsRequest(app);
    deleteRecordsRequest.setIDs(ids);
    const bulkRequestItem = new BulkRequestItemModel(
      'DELETE',
      kintoneConnection.get(this).getPathURI('RECORDS'),
      deleteRecordsRequest
    );
    bulkRequests.get(this).addRequest(bulkRequestItem);
    return this;
  }

  /**
     * Delete records at the specific revision
     * @param {Integer} app
     * @param {HashTable <Integer, Integer>} idsWithRevision
     * @return {this}
     */
  deleteRecordsWithRevision(app, idsWithRevision) {
    const deleteRecordsRequest =
            new RecordModel.DeleteRecordsRequest(app);
    deleteRecordsRequest.setIDsWithRevision(idsWithRevision);

    const bulkRequestItem = new BulkRequestItemModel(
      'DELETE',
      kintoneConnection.get(this).getPathURI('RECORDS'),
      deleteRecordsRequest
    );
    bulkRequests.get(this).addRequest(bulkRequestItem);
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
    const updateRecordRequest =
            new RecordModel.UpdateRecordAssigneesRequest(
              app, record, assignees, revision);

    const bulkRequestItem = new BulkRequestItemModel(
      'PUT',
      kintoneConnection.get(this).getPathURI('RECORD_ASSIGNEES'),
      updateRecordRequest
    );
    bulkRequests.get(this).addRequest(bulkRequestItem);
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
    const updateRecordRequest =
            new RecordModel.UpdateRecordStatusRequest(
              app, id, action, assignee, revision);

    const bulkRequestItem = new BulkRequestItemModel(
      'PUT',
      kintoneConnection.get(this).getPathURI('RECORD_STATUS'),
      updateRecordRequest
    );
    bulkRequests.get(this).addRequest(bulkRequestItem);
    return this;
  }

  /**
     * Update status of the multi records
     * @param {Integer} app
     * @param {Array<RecordStatusUpdate>} recordsStatusUpdate
     * @return {this}
     */
  updateRecordsStatus(app, records) {
    const updateRecordsRequest = new RecordModel.UpdateRecordsRequest(
      app, records);

    const bulkRequestItem = new BulkRequestItemModel(
      'PUT',
      kintoneConnection.get(this).getPathURI('RECORDS_STATUS'),
      updateRecordsRequest
    );
    bulkRequests.get(this).addRequest(bulkRequestItem);
    return this;
  }

  /**
     * Execute the BulkRequest and get data which is returned from kintone.
     * @return {promise}
     */
  execute() {
    return kintoneConnection.get(this)
      .addRequestOption('json', true)
      .request('POST', 'BULK_REQUEST', bulkRequests.get(this).toJSON())
      .then((result) => {
        return result;
      }).catch((err) => {
        throw new KintoneExeption(err);
      });
  }
}
module.exports = BulkRequest;
