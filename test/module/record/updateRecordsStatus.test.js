
/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require('nock');

const common = require('../../../test/utils/common');

const {Connection, Auth, Record, KintoneException} = require(common.MAIN_PATH);

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

describe('updateRecordsStatus function', () => {
  describe('common case', () => {
    const data = {
      app: 1,
      records: [{
        id: 1,
        action: 'Submit',
        assignee: 'user1',
        revision: 2
      }]
    };

    it('should return a promise', () => {
      nock('https://' + common.DOMAIN)
        .put('/k/v1/records/status.json')
        .reply(200, {'revision': '3'});

      const recordModule = new Record(conn);
      const updateRecordsStatusResult = recordModule.updateRecordsStatus(data.app, data.records);
      expect(updateRecordsStatusResult).toHaveProperty('then');
      expect(updateRecordsStatusResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid data', () => {
      it('[Record-200] should changed successfully the status of the multiple record', () => {
        const data = {
          app: 1,
          records: [{
            id: 1,
            action: 'Submit',
            assignee: 'user1',
            revision: 2
          },
          {
            id: 2,
            action: 'Approve',
            assignee: 'user1',
            revision: 1
          }]
        };

        const expectResult = {
          'records': [{
            'id': '1',
            'revision': '3'
          },
          {
            'id': '2',
            'revision': '2'
          }]
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/records/status.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, expectResult);

        const recordModule = new Record(conn);
        const updateRecordsStatusResult = recordModule.updateRecordsStatus(data.app, data.records);
        return updateRecordsStatusResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('Verify the records are updated with new statuses and assignees', () => {
      it('[Record-201] should changed successfully the status of the multiple record', () => {
        const data = {
          app: 1,
          records: [{
            id: 1,
            action: 'Submit',
            assignee: 'user1',
            revision: 2
          },
          {
            id: 2,
            action: 'Approve',
            assignee: 'user1',
            revision: 1
          }]
        };

        const expectResult = {
          'records': [{
            'id': '1',
            'revision': '3'
          },
          {
            'id': '2',
            'revision': '2'
          }]
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/records/status.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, expectResult);

        const recordModule = new Record(conn);
        const updateRecordsStatusResult = recordModule.updateRecordsStatus(data.app, data.records);
        return updateRecordsStatusResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('The record is added successfully for app in guest space', () => {
      it('[Record-210] should return the error in the result', () => {
        const data = {
          app: 1,
          records: [{
            id: 10,
            action: 'Submit',
            assignee: 'user2',
            revision: 2
          },
          {
            id: 20,
            action: 'Submit',
            assignee: 'user1',
            revision: 4
          }]
        };

        const expectResult = {
          'records': [{
            'id': '10',
            'revision': '3'
          },
          {
            'id': '20',
            'revision': '5'
          }]
        };

        nock('https://' + common.DOMAIN)
          .put('/k/guest/1/v1/records/status.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, expectResult);

        const conn1 = new Connection(common.DOMAIN, auth, common.GUEST_SPACEID);
        const recordsStatus = new Record(conn1);
        const updateRecordsStatusResult = recordsStatus.updateRecordsStatus(data.app, data.records);
        return updateRecordsStatusResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('The function still work correctly when executing with interger as string type', () => {
      it('[Record-211] should return the error in the result', () => {
        const data = {
          app: '20',
          records: [{
            id: '10',
            action: 'Submit',
            assignee: 'user1',
            revision: 2
          },
          {
            id: '10',
            action: 'Submit',
            assignee: 'user2',
            revision: 4
          }]
        };

        const expectResult = {
          'records': [{
            'id': '10',
            'revision': '3'
          },
          {
            'id': '20',
            'revision': '5'
          }]
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/records/status.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, expectResult);

        const recordModule = new Record(conn);
        const updateRecordsStatusResult = recordModule.updateRecordsStatus(data.app, data.records);
        return updateRecordsStatusResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('Verify the number of records that can be updated at once is 100', () => {
      it('[Record-213] should changed successfully the status of the multiple record', () => {
        const number = 100;
        const data = {
          app: '20',
          record: {
            id: '10',
            action: 'Submit',
            assignee: 'user1',
            revision: 2
          }
        };
        nock('https://' + common.DOMAIN)
          .put('/k/v1/records/status.json', (rqBody) => {
            expect(rqBody.app).toBe(data.app);
            expect(rqBody.records).toMatchObject(common.generateRecord(number, data.record));
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, {'records': {}});
        const recordModule = new Record(conn);
        const updateRecordsStatusResult = recordModule.updateRecordsStatus(data.app, common.generateRecord(number, data.record));
        return updateRecordsStatusResult.then((rsp) => {
          expect(rsp).toHaveProperty('records');
        });
      });
    });
  });

  describe('error case', () => {
    describe('Error will be displayed when there is record with error in Assignee', () => {
      it('[Record-203] should return the error in the result', () => {
        const data = {
          app: 1,
          records: [{
            id: 1,
            action: 'Submit',
            assignee: 'unexisted_user',
            revision: 2
          },
          {
            id: 2,
            action: 'Submit',
            assignee: 'unexisted_user',
            revision: 3
          }]
        };

        const expectResult = {
          'code': 'GAIA_IL26',
          'id': 'iaQwvEhqv723hIS4V6DG',
          'message': 'The specified user (code：unexisted_user) not found.'
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/records/status.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(400, expectResult);

        const recordModule = new Record(conn);
        const updateRecordsStatusResult = recordModule.updateRecordsStatus(data.app, data.records);
        return updateRecordsStatusResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('Error will be displayed when there is record with error in ID', () => {
      it('[Record-204] should return the error in the result', () => {
        const data = {
          app: 1,
          records: [{
            id: 'abc',
            action: 'Submit',
            assignee: 'user1',
            revision: 2
          },
          {
            id: 'abd',
            action: 'Submit',
            assignee: 'user1',
            revision: 3
          }]
        };

        const expectResult = {
          'code': 'CB_VA01',
          'id': 'VO6qddcYmQyHwqhPqud1',
          'message': 'Missing or invalid input.',
          'errors': {
            'records[1].id': {
              'messages': [
                'Enter an integer value.'
              ]
            },
            'records[0].id': {
              'messages': [
                'Enter an integer value.'
              ]
            }
          }
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/records/status.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(400, expectResult);

        const recordModule = new Record(conn);
        const updateRecordsStatusResult = recordModule.updateRecordsStatus(data.app, data.records);
        return updateRecordsStatusResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('Error will be displayed when there is record with error in revision', () => {
      it('[Record-205] should return the error in the result', () => {
        const data = {
          app: 1,
          records: [{
            id: 1,
            action: 'Submit',
            assignee: 'user1',
            revision: 'abc'
          },
          {
            id: 2,
            action: 'Submit',
            assignee: 'user1',
            revision: 'abc'
          }]
        };

        const expectResult = {
          'code': 'CB_VA01',
          'id': 'NEszpttsFpGaMUT659VI',
          'message': 'Missing or invalid input.',
          'errors': {
            'records[0].revision': {
              'messages': [
                'Enter an integer value.'
              ]
            },
            'records[1].revision': {
              'messages': [
                'Enter an integer value.'
              ]
            }
          }
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/records/status.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(400, expectResult);

        const recordModule = new Record(conn);
        const updateRecordsStatusResult = recordModule.updateRecordsStatus(data.app, data.records);
        return updateRecordsStatusResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('The error will be displayed when using invalid app ID', () => {
      it('[Record-206] should return the error in the result', () => {
        const data = {
          app: 'abc',
          records: [{
            id: 10,
            action: 'Submit',
            assignee: 'user1',
            revision: -1
          },
          {
            id: 20,
            action: 'Submit',
            assignee: 'user2',
            revision: -1
          }]
        };

        const expectResult = {
          'code': 'CB_VA01',
          'id': 'VO7l8xmK9ToZfdRpXjXw',
          'message': 'Missing or invalid input.',
          'errors': {
            'app': {
              'messages': [
                'Enter an integer value.'
              ]
            }
          }
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/records/status.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(400, expectResult);

        const recordModule = new Record(conn);
        const updateRecordsStatusResult = recordModule.updateRecordsStatus(data.app, data.records);
        return updateRecordsStatusResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('The error will be displayed when using method without app ID', () => {
      it('[Record-207] should return the error in the result', () => {
        const data = {
          records: [{
            id: 10,
            action: 'Submit',
            assignee: 'user3',
            revision: -1
          },
          {
            id: 20,
            action: 'Submit',
            assignee: 'user2',
            revision: -1
          }]
        };

        const expectResult = {
          'code': 'CB_VA01',
          'id': 'dHPIvqdeN3ZlPhfHaHQ8',
          'message': 'Missing or invalid input.',
          'errors': {
            'app': {
              'messages': [
                'Required field.'
              ]
            }
          }
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/records/status.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(400, expectResult);

        const recordModule = new Record(conn);
        const updateRecordsStatusResult = recordModule.updateRecordsStatus('', data.records);
        return updateRecordsStatusResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('The error will be displayed when using method without record ID', () => {
      it('[Record-208] should return the error in the result', () => {
        const data = {
          app: 20,
          records: [{
            action: 'Submit',
            assignee: 'user1',
            revision: -1
          },
          {
            id: 20,
            action: 'Submit',
            assignee: 'user2',
            revision: -1
          }]
        };

        const expectResult = {
          'code': 'CB_VA01',
          'id': 'VwTXwWEBiNosD8xfrL3w',
          'message': 'Missing or invalid input.',
          'errors': {
            'records[0].id': {
              'messages': [
                'Required field.'
              ]
            }
          }
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/records/status.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(400, expectResult);

        const recordModule = new Record(conn);
        const updateRecordsStatusResult = recordModule.updateRecordsStatus(data.app, data.records);
        return updateRecordsStatusResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('The error will be displayed when using method without assignee', () => {
      it('[Record-209] should return the error in the result', () => {
        const data = {
          app: 20,
          records: [{
            id: 10,
            action: 'Submit',
            revision: -1
          },
          {
            id: 20,
            action: 'Submit',
            revision: -1
          }]
        };

        const expectResult = {
          'code': 'GAIA_SA01',
          'id': '5j3ige69pKHYyO9037FW',
          'message': 'Assignee is required.'
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/records/status.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(520, expectResult);

        const recordModule = new Record(conn);
        const updateRecordsStatusResult = recordModule.updateRecordsStatus(data.app, data.records);
        return updateRecordsStatusResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('The error will be displayed when the process management featured is disabled', () => {
      it('[Record-212] should return the error in the result', () => {
        const data = {
          app: 1,
          records: [{
            id: 10,
            action: 'Submit',
            assignee: 'user1',
            revision: -1
          },
          {
            id: 20,
            action: 'Submit',
            assignee: 'user2',
            revision: -1
          }]
        };

        const expectResult = {
          'code': 'GAIA_ST02',
          'id': '8fXKy9n8PFNJKRtHgmiz',
          'message': 'Your request failed. The process management feature has been disabled.'
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/records/status.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(520, expectResult);

        const recordModule = new Record(conn);
        const updateRecordsStatusResult = recordModule.updateRecordsStatus(data.app, data.records);
        return updateRecordsStatusResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('Verify the error displays when number of records is > 100', () => {
      it('[Record-214] should return the error in the result', () => {
        const number = 102;
        const data = {
          app: 1,
          record: {
            id: 10,
            action: 'Submit',
            assignee: 'user1',
            revision: -1
          }
        };

        const expectResult = {
          'id': 'Tl0ogUCh0ZMOHSHSzSbB',
          'code': 'CB_VA01',
          'message': 'Missing or invalid input.',
          'errors': {
            'records': {
              'messages': [
                'A maximum of 100 records can be updated at one time.'
              ]
            }
          }
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/records/status.json', (rqBody) => {
            expect(rqBody.app).toBe(data.app);
            expect(rqBody.records).toMatchObject(common.generateRecord(number, data.record));
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(400, expectResult);
        const recordModule = new Record(conn);
        const updateRecordsStatusResult = recordModule.updateRecordsStatus(data.app, common.generateRecord(number, data.record));
        return updateRecordsStatusResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('Invalid data', () => {
      it('[Record-202] should return error when the action name is blank', () => {
        const data = {
          app: 1,
          records: [{
            id: 1,
            action: '',
            assignee: 'user1',
            revision: 2
          }]
        };

        const expectResult = {
          'code': 'CB_VA01',
          'id': 'IARR1iA2jOY5dMzRzVys',
          'message': 'Missing or invalid input.',
          'errors': {
            'records[0].action': {'messages': ['Required field.']}
          }
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/records/status.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .reply(400, expectResult);

        const recordModule = new Record(conn);
        const updateRecordsStatusResult = recordModule.updateRecordsStatus(data.app, data.records);
        return updateRecordsStatusResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
  });
});