
/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require('nock');

const common = require('../../utils/common');

const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const BulkRequest = require('../../../src/module/bulkRequest/BulkRequest');

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);


describe('BulkRequest module', () => {
  describe('Common case', () => {
    const data = {
      appID: 1,
      recordData: {
        Text_0: {
          value: 1
        }
      },
      updateKey: {
        field: 'Update_Key',
        value: '1'
      }
    };

    const bulkRequest = new BulkRequest(conn);

    const addRecord = bulkRequest.addRecord(data.appID);
    describe('addRecord function', () => {
      it('should return BulkRequest', () => {
        expect(addRecord).toBeInstanceOf(BulkRequest);
      });
    });

    const addRecords = bulkRequest.addRecords(data.appID, [data.recordData]);
    describe('addRecords function', () => {
      it('should return BulkRequest', () => {
        expect(addRecords).toBeInstanceOf(BulkRequest);
      });
    });

    const updateRecordById = bulkRequest.updateRecordByID(data.appID, '', data.recordData);
    describe('updateRecordById function', () => {
      it('should return BulkRequest', () => {
        expect(updateRecordById).toBeInstanceOf(BulkRequest);
      });
    });

    const updateRecordByUpdateKey = bulkRequest.updateRecordByUpdateKey(data.appID, data.updateKey, data.recordData);
    describe('updateRecordByUpdateKey function', () => {
      it('should return BulkRequest', () => {
        expect(updateRecordByUpdateKey).toBeInstanceOf(BulkRequest);
      });
    });

    const updateRecords = bulkRequest.updateRecords();
    describe('updateRecords function', () => {
      it('should return BulkRequest', () => {
        expect(updateRecords).toBeInstanceOf(BulkRequest);
      });
    });

    const deleteRecords = bulkRequest.deleteRecords();
    describe('deleteRecords function', () => {
      it('should return BulkRequest', () => {
        expect(deleteRecords).toBeInstanceOf(BulkRequest);
      });
    });

    const deleteRecordsWithRevision = bulkRequest.deleteRecordsWithRevision();
    describe('deleteRecordsWithRevision function', () => {
      it('should return BulkRequest', () => {
        expect(deleteRecordsWithRevision).toBeInstanceOf(BulkRequest);
      });
    });

    const updateRecordAssignees = bulkRequest.updateRecordAssignees();
    describe('updateRecordAssignees function', () => {
      it('should return BulkRequest', () => {
        expect(updateRecordAssignees).toBeInstanceOf(BulkRequest);
      });
    });

    const updateRecordStatus = bulkRequest.updateRecordStatus();
    describe('updateRecordStatus function', () => {
      it('should return BulkRequest', () => {
        expect(updateRecordStatus).toBeInstanceOf(BulkRequest);
      });
    });

    const updateRecordsStatus = bulkRequest.updateRecordsStatus();
    describe('updateRecordsStatus function', () => {
      it('should return BulkRequest', () => {
        expect(updateRecordsStatus).toBeInstanceOf(BulkRequest);
      });
    });

    nock('https://' + common.DOMAIN)
      .post(`/k/v1/bulkRequest.json`)
      .reply(200, {
        'record': {}});

    describe('execute function', () => {
      const execute = bulkRequest.execute();
      it(' should return Promiss', () => {
        expect(execute).toHaveProperty('then');
        expect(execute).toHaveProperty('catch');
      });
    });
  });

  describe('Success Case', () => {
    describe('Valid request', () => {

      const addRecordData = {app: 1, record: {Text: {value: 'add'}}};
      const addRecordsData = {app: 2, records: [addRecordData.record]};
      const updateRecordByIdData = {app: 1, id: 1, record: {Text: {value: 'add'}}};
      const updateRecordByUpdateKeyData = {
        app: 2,
        updateKey: {field: 'key_field', value: 1},
        record: {Text: {value: 'update key'}}
      };

      const updateRecordsData = {
        app: 1,
        records: [{id: 5, record: {Text: {value: 'update records'}}}]
      };

      const deleteRecordsData = {app: 3, ids: [1, 2]};

      const deleteRecordsWithRevisionData = {app: 3, idsWithRevision: {3: 1, 4: 2}};
      const updateRecordAssigneesData = {'app': 1, 'id': 1, 'assignees': ['user2']};

      const expectBody = {
        'requests': [
          {
            'method': 'POST',
            'api': '/k/v1/record.json',
            'payload': {
              'app': 1,
              'record': {Text: {value: 'add'}}
            }
          },
          {
            'method': 'POST',
            'api': '/k/v1/records.json',
            'payload': {
              'app': 2,
              'records': [{Text: {value: 'add'}}]
            }
          },
          {
            'method': 'PUT',
            'api': '/k/v1/record.json',
            'payload': {
              'app': 1,
              'id': 1,
              'record': {Text: {value: 'add'}}
            }
          },
          {
            'method': 'PUT',
            'api': '/k/v1/record.json',
            'payload': {
              app: 2,
              updateKey: {field: 'key_field', value: 1},
              record: {Text: {value: 'update key'}}
            }
          },
          {
            'method': 'PUT',
            'api': '/k/v1/records.json',
            'payload': {
              app: 1,
              records: [{id: 5, record: {Text: {value: 'update records'}}}]
            }
          },
          {
            'method': 'DELETE',
            'api': '/k/v1/records.json',
            'payload': {app: 3, ids: [1, 2]}
          },
          {
            'method': 'DELETE',
            'api': '/k/v1/records.json',
            'payload': {app: 3, ids: ['3', '4'], revisions: [1, 2]}
          },
          {
            'method': 'PUT',
            'api': '/k/v1/record/assignees.json',
            'payload': {
              'app': 1,
              'id': 1,
              'assignees': ['user2']
            }
          },

        ]
      };
      nock('https://' + common.DOMAIN)
        .post(`/k/v1/bulkRequest.json`, (rqBody) => {
          console.log(rqBody.requests[1].payload);
          expect(rqBody).toMatchObject(expectBody);
          return true;
        })
        .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
          expect(authHeader).toBe(Buffer.from(common.USERNAME + ':' + common.PASSWORD).toString('base64'));
          return true;
        })
        .matchHeader('Content-Type', (type) => {
          expect(type).toBe('application/json');
          return true;
        })
        .reply(200, {
          'results': {}});

      const bunkRequestResult = new BulkRequest(conn);
      bunkRequestResult.addRecord(addRecordData.app, addRecordData.record)
        .addRecords(addRecordsData.app, addRecordsData.records)
        .updateRecordByID(updateRecordByIdData.app, updateRecordByIdData.id, updateRecordByIdData.record)
        .updateRecordByUpdateKey(updateRecordByUpdateKeyData.app, updateRecordByUpdateKeyData.updateKey, updateRecordByUpdateKeyData.record)
        .updateRecords(updateRecordsData.app, updateRecordsData.records)
        .deleteRecords(deleteRecordsData.app, deleteRecordsData.ids)
        .deleteRecordsWithRevision(deleteRecordsWithRevisionData.app, deleteRecordsWithRevisionData.idsWithRevision)
        .updateRecordAssignees(updateRecordAssigneesData.app, updateRecordAssigneesData.id, updateRecordAssigneesData.assignees);

      it('should execute correctly all methods', () => {
        return bunkRequestResult.execute().then((resp)=> {
          expect(resp).toHaveProperty('results');
        });
      });
    });
  });

  describe('Error Case', () => {
    describe('No Specify parametor for addRecord function', () => {
      const addRecordData = {app: 0, record: {Text: {value: 'add'}}};
      const addRecordsData = {app: 2, records: [addRecordData.record]};
      const expectBody = {
        'requests': [
          {
            'method': 'POST',
            'api': '/k/v1/record.json',
            'payload': {
              'app': 0,
              'record': {Text: {value: 'add'}}
            }
          },
          {
            'method': 'POST',
            'api': '/k/v1/records.json',
            'payload': {
              'app': 2,
              'records': [{Text: {value: 'add'}}]
            }
          }
        ]
      };
      const expectResult = {'results':
      [{'code': 'CB_VA01',
        'id': 'l1Sg4XDYVO7h26dZeCti',
        'message': 'Missing or invalid input.',
        'errors': {'app': {'messages': ['must be greater than or equal to 1']}}},
      {}
      ]};
      nock('https://' + common.DOMAIN)
        .post(`/k/v1/bulkRequest.json`, (rqBody) => {
          expect(rqBody).toMatchObject(expectBody);
          return true;
        })
        .reply(400, expectResult);

      const bulkRequest = new BulkRequest(conn);
      bulkRequest.addRecord(addRecordData.app, addRecordData.record)
        .addRecords(addRecordsData.app, addRecordsData.records);

      it('bunkRequest result should have "results" property', () => {
        return bulkRequest.execute().catch((err)=> {
          expect(err.get().errors).toMatchObject(expectResult);
        });
      });
    });
  });
});