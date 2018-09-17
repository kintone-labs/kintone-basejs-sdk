
/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require('nock');
const common = require('../../utils/common');
const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const Record = require('../../../src/module/record/Record');

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

describe('updateRecordById function', () => {
  describe('common case', () => {

    it('[Record module-0-common] - should return a promise', () => {
      const data = {
        app: 1,
        id: 1,
        record: {
          Text_0: {
            value: 123
          }
        },
        revision: 2
      };
      nock('https://' + common.DOMAIN)
        .put('/k/v1/record.json')
        .reply(200, { 'revisions': '1' });

      const recordModule = new Record(conn);
      const updateRecordByIdResult = recordModule.updateRecordByID(data.app, data.id, data.record, data.revision);
      expect(updateRecordByIdResult).toHaveProperty('then');
      expect(updateRecordByIdResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('valid data', () => {
      it('[Record module-65] - should update successfully the record', () => {
        const data = {
          app: 1,
          id: 1,
          record: {
            Text_0: {
              value: 123
            }
          },
          revision: 2
        };
        nock('https://' + common.DOMAIN)
          .put('/k/v1/record.json', (rqBody) => {
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
          .reply(200, { 'revision': '3' });

        const recordModule = new Record(conn);
        const updateRecordByIdResult = recordModule.updateRecordByID(data.app, data.id, data.record, data.revision);
        return updateRecordByIdResult.then((rsp) => {
          expect(rsp.revision).toEqual('3');
        });
      });

      it('[Record module-66] - should update successfully when the revision is -1', () => {
        const data = {
          app: 1,
          id: 1,
          record: {
            Text_0: {
              value: 123
            }
          },
          revision: -1
        };
        nock('https://' + common.DOMAIN)
          .put('/k/v1/record.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .reply(200, { 'revision': '3' });

        const recordModule = new Record(conn);
        const updateRecordByIdResult = recordModule.updateRecordByID(data.app, data.id, data.record, data.revision);
        return updateRecordByIdResult.then((rsp) => {
          expect(rsp).toHaveProperty('revision');
        });
      });
      /**
      * Todo: implement another success case
      */

      /**
       * Data table
       * Verify the data for record with table is added successfully
       */
      it('[Record module-82] - should update the data successfully for record with table', () => {
        const recordID = 1;
        const appID = 19;
        const recordDataUpdate = {
          'app': appID,
          'id': recordID,
          'revision': null,
          'record': {
            'Table': {
              'value': [
                {
                  'id': '44915',
                  'value': {
                    'Number_0': {
                      'type': 'NUMBER',
                      'value': '5'
                    },
                    'Number': {
                      'type': 'NUMBER',
                      'value': '9'
                    },
                    'Text': {
                      'type': 'SINGLE_LINE_TEXT',
                      'value': 'Updated'
                    }
                  }
                }
              ]
            }
          }
        };
        const recordsData = [recordDataUpdate];
        nock('https://' + common.DOMAIN)
          .put('/k/v1/record.json', (rqBody) => {
            expect(rqBody.record).toMatchObject(recordsData);
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
          .reply(200, { 'revision': '2' });

        const recordModule = new Record(conn);
        const updateRecordByIdResult = recordModule.updateRecordByID(appID, recordID, recordsData);
        return updateRecordByIdResult.then((rsp) => {
          expect(rsp.revision).toEqual('2');
        });
      });

      /**
       * Guest space
       * The record is updated successfully for app in guest space
       */
      it('[Record module-83] - should update record successfully for app in guest space', () => {
        const connGuestSpace = new Connection(common.DOMAIN, auth, common.GUEST_SPACEID);
        const recordID = 1;
        const appID = 19;
        const recordDataUpdate = {
          'app': appID,
          'id': recordID,
          'revision': null,
          'record': {
            'Table': {
              'value': [
                {
                  'id': '44915',
                  'value': {
                    'Number_0': {
                      'type': 'NUMBER',
                      'value': '5'
                    },
                    'Number': {
                      'type': 'NUMBER',
                      'value': '9'
                    },
                    'Text': {
                      'type': 'SINGLE_LINE_TEXT',
                      'value': 'Updated'
                    }
                  }
                }
              ]
            }
          }
        };
        const recordsData = [recordDataUpdate];
        nock('https://' + common.DOMAIN)
          .put('/k/v1/record.json', (rqBody) => {
            expect(rqBody.record).toMatchObject(recordsData);
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
          .reply(200, { 'revision': '3' });

        const recordModule = new Record(connGuestSpace);
        const updateRecordByIdResult = recordModule.updateRecordByID(appID, recordID, recordsData);
        return updateRecordByIdResult.then((rsp) => {
          expect(rsp.revision).toEqual('3');
        });
      });

      /**
       * Invalid input type
       * The function still work correctly when executing with interger as string type (input string for interger and vice versa) 
       */
      it('[Record module-84] - should update correctly when executing with interger as string type (input string for interger and vice versa) ', () => {
        const recordID = '1';
        const appID = '19';
        const recordDataUpdate = {
          'app': appID,
          'id': recordID,
          'revision': null,
          'record': {
            'Table': {
              'value': [
                {
                  'id': '44915',
                  'value': {
                    'Number_0': {
                      'type': 'NUMBER',
                      'value': '5'
                    },
                    'Number': {
                      'type': 'NUMBER',
                      'value': '9'
                    },
                    'Text': {
                      'type': 'SINGLE_LINE_TEXT',
                      'value': 'Updated'
                    }
                  }
                }
              ]
            }
          }
        };
        const recordsData = [recordDataUpdate];
        nock('https://' + common.DOMAIN)
          .put('/k/v1/record.json', (rqBody) => {
            expect(rqBody.record).toMatchObject(recordsData);
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
          .reply(200, { 'revision': '4' });

        const recordModule = new Record(conn);
        const updateRecordByIdResult = recordModule.updateRecordByID(appID, recordID, recordsData);
        return updateRecordByIdResult.then((rsp) => {
          expect(rsp.revision).toEqual('4');
        });
      });
    });

    describe('error case', () => {
      describe('wrong revision', () => {
        it('[Record module-67] - should return error when using wrong revison', () => {
          const data = {
            app: 1,
            id: 2,
            record: {
              Text_0: {
                value: 123
              }
            }
          };
          const wrongRevison = 3;
          const expectResult = {
            'code': 'GAIA_CO02',
            'id': 'MJkW0PkiEJ3HhuPRkl3H',
            'message': '指定したrevisionは最新ではありません。ほかのユーザーがレコードを更新した可能性があります。'
          };
          nock('https://' + common.DOMAIN)
            .put('/k/v1/record.json', (rqBody) => {
              expect(rqBody.revision).toEqual(wrongRevison);
              return true;
            })
            .reply(409, expectResult);
          const recordModule = new Record(conn);
          return recordModule.updateRecordByID(data.app, data.id, data.record, wrongRevison).catch((err) => {
            expect(err.get()).toMatchObject(expectResult);
          });
        });
      });
      /**
      * Todo: implement another error case
      */

      /**
       * Update data system field
       * Error is displayed when updating these fields:
       *  Created by
       *  Updated by
       *  Created datetime
       *  Updated datetime
       */
      it('[Record module-68] - should return the error in the result: Error is displayed when updating these fields:' +
        'Created by' +
        'Updated by' +
        'Created datetime' +
        'Updated datetime', () => {
          const recordID = 95;
          const appID = 22;
          const recordDataUpdate = {
            'app': appID,
            'id': recordID,
            'revision': null,
            'record': {
              'Updated_by': {
                'value': 'Updated'
              }
            }
          };
          const recordsData = [recordDataUpdate];

          const expectResult = {
            'code': 'CB_IJ01',
            'id': 'wcRfYn4IOTtdsHuExF5a',
            'message': 'Invalid JSON string.'
          };
          nock('https://' + common.DOMAIN)
            .put(`/k/v1/record.json`, (rqBody) => {
              expect(rqBody.record).toMatchObject(recordsData);
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
            .reply(400, expectResult);
          const recordModule = new Record(conn);
          const getRecordResult = recordModule.updateRecordByID(appID, recordID, recordsData);
          return getRecordResult.catch((err) => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toMatchObject(expectResult);
          });
        });
      /**
       * Permission
       * Error happens when user does not have Edit permission for app
       */
      it('[Record module-69] - should return the error in the result: Error happens when user does not have Edit permission for app', () => {
        const recordID = 95;
        const appID = 22;
        const recordDataUpdate = {
          'app': 22,
          'id': 95,
          'revision': null,
          'record': {
            'title_event': {
              'value': 'Updated value'
            }
          }
        };
        const recordsData = [recordDataUpdate];

        const expectResult = {
          'code': 'CB_NO02',
          'id': 'M00VPaOdPEmu4kNlBawh',
          'message': 'No privilege to proceed.'
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/record.json`, (rqBody) => {
            expect(rqBody.record).toMatchObject(recordsData);
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
          .reply(400, expectResult);
        const recordModule = new Record(conn);
        const getRecordResult = recordModule.updateRecordByID(appID, recordID, recordsData);
        return getRecordResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });

      /**
       * Permission
       * Error happens when user does not have Edit permission for record
       */
      it('[Record module-70] - should return the error in the result: Error happens when user does not have Edit permission for record', () => {
        const recordID = 95;
        const appID = 22;
        const recordDataUpdate = {
          'app': 22,
          'id': 95,
          'revision': null,
          'record': {
            'title_event': {
              'value': 'Updated value'
            }
          }
        };
        const recordsData = [recordDataUpdate];

        const expectResult = {
          'code': 'CB_NO02',
          'id': 'M00VPaOdPEmu4kNlBawh',
          'message': 'No privilege to proceed.'
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/record.json`, (rqBody) => {
            expect(rqBody.record).toMatchObject(recordsData);
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
          .reply(400, expectResult);
        const recordModule = new Record(conn);
        const getRecordResult = recordModule.updateRecordByID(appID, recordID, recordsData);
        return getRecordResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });

      /**
       * Permission
       * Error happens when user does not have Edit permission for field
       */
      it('[Record module-71] - should return the error in the result: Error happens when user does not have Edit permission for field', () => {
        const recordID = 95;
        const appID = 22;
        const recordDataUpdate = {
          'app': 22,
          'id': 95,
          'revision': null,
          'record': {
            'title_event': {
              'value': 'Updated value'
            }
          }
        };
        const recordsData = [recordDataUpdate];
        const expectResult = {
          'code': 'GAIA_FU01',
          'id': 'xnADSZe3pmfqNwkVtmsg',
          'message': 'Edit permissions are required to edit field "title_event".'
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/record.json`, (rqBody) => {
            expect(rqBody.record).toMatchObject(recordsData);
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
          .reply(403, expectResult);
        const recordModule = new Record(conn);
        const getRecordResult = recordModule.updateRecordByID(appID, recordID, recordsData);
        return getRecordResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
      /**
       * Invalid app ID
       * The error will be displayed when using invalid app ID (unexisted, negative number, 0)
       */
      it('[Record module-72] - should return the error in the result: The error will be displayed when using invalid app ID (unexisted, negative number, 0)', () => {
        const recordID = 95;
        const appID = 220;
        const recordDataUpdate = {
          'app': 22,
          'id': 95,
          'revision': null,
          'record': {
            'title_event': {
              'value': 'Updated value'
            }
          }
        };
        const recordsData = [recordDataUpdate];
        const expectResult = {
          'code': 'GAIA_AP01',
          'id': 'F1m5aSXHdHNEWxY9gZdS',
          'message': 'The app (ID: 220) not found. The app may have been deleted.'
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/record.json`, (rqBody) => {
            expect(rqBody.record).toMatchObject(recordsData);
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
          .reply(403, expectResult);
        const recordModule = new Record(conn);
        const getRecordResult = recordModule.updateRecordByID(appID, recordID, recordsData);
        return getRecordResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
      /**
       * Invalid record ID
       * The error will be displayed when using invalid record ID (unexisted, negative number, 0)
       */
      it('[Record module-73] - should return the error in the result: The error will be displayed when using invalid record ID (unexisted, negative number, 0)', () => {
        const recordID = -9500;
        const appID = 22;
        const recordDataUpdate = {
          'app': appID,
          'id': recordID,
          'revision': null,
          'record': {
            'title_event': {
              'value': 'Updated value'
            }
          }
        };
        const recordsData = [recordDataUpdate];
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'mQTR5QFYxbIuTYWoX5Dl',
          'message': 'Missing or invalid input.',
          'errors': {
            'id': {
              'messages': [
                'must be greater than or equal to 1'
              ]
            }
          }
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/record.json`, (rqBody) => {
            expect(rqBody.record).toMatchObject(recordsData);
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
          .reply(403, expectResult);
        const recordModule = new Record(conn);
        const getRecordResult = recordModule.updateRecordByID(appID, recordID, recordsData);
        return getRecordResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
      /**
       * Missing required field
       * The error will be displayed when using method without app ID
       */
      it('[Record module-74] - should return the error in the result: The error will be displayed when using invalid record ID (unexisted, negative number, 0)', () => {
        const recordID = -9500;
        const appID = null;
        const recordDataUpdate = {
          'app': appID,
          'id': recordID,
          'revision': null,
          'record': {
            'title_event': {
              'value': 'Updated value'
            }
          }
        };
        const recordsData = [recordDataUpdate];
        const expectResult = {
          'code': 'CB_IJ01',
          'id': '2EvqyBpppiTZP4wQfPtx',
          'message': 'Invalid JSON string.'
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/record.json`, (rqBody) => {
            expect(rqBody.record).toMatchObject(recordsData);
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
          .reply(400, expectResult);
        const recordModule = new Record(conn);
        const getRecordResult = recordModule.updateRecordByID(appID, recordID, recordsData);
        return getRecordResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
      /**
       * Missing required field
       * Revision is increased by 1, no data is updated when using method without records data
       */
      it('[Record module-75] - should return revision and increased by 1, no data updated', () => {
        const recordID = 95;
        const appID = 22;
        const recordDataUpdate = {
          'app': appID,
          'id': recordID,
          'revision': null,
          'record': {
          }
        };
        const recordsData = [recordDataUpdate];
        nock('https://' + common.DOMAIN)
          .put('/k/v1/record.json', (rqBody) => {
            expect(rqBody.record).toMatchObject(recordsData);
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
          .reply(200, { 'revision': '7' });

        const recordModule = new Record(conn);
        const updateRecordByIdResult = recordModule.updateRecordByID(appID, recordID, recordsData);
        return updateRecordByIdResult.then((rsp) => {
          expect(rsp.revision).toEqual('7');
        });
      });
      /**
       * Required data
       * Error will be displayed when there is record without data for required field in the records arrray
       */
      it('[Record module-76] - should return the error in the result: Error will be displayed when there is record without data for required field in the records arrray', () => {
        const recordID = 95;
        const appID = 22;
        const recordDataUpdate = {
          'app': appID,
          'id': recordID,
          'revision': null,
          'record': {
            'title_event': {
              'value': 'Updated value'
            }
          }
        };
        const recordsData = [recordDataUpdate];
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'VQQnxMBZrLPuu8c3mso5',
          'message': 'Missing or invalid input.',
          'errors': {
            'record.RequiredField.value': {
              'messages': [
                'Required.'
              ]
            }
          }
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/record.json`, (rqBody) => {
            expect(rqBody.record).toMatchObject(recordsData);
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
          .reply(400, expectResult);
        const recordModule = new Record(conn);
        const getRecordResult = recordModule.updateRecordByID(appID, recordID, recordsData);
        return getRecordResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });

      /**
       * Invalid field
       * The field will be skipped when there is record with invalid field in the records array
       */
      it('[Record module-77] - should update record and skipped invalid field in the records array', () => {
        const recordID = 95;
        const appID = 22;
        const recordDataUpdate = {
          'app': appID,
          'id': recordID,
          'revision': null,
          'record': {
            'title_event': {
              'value': 'Updated'
            },
            'RequiredField22': {
              'value': 'Updated'
            }
          }
        };
        const recordsData = [recordDataUpdate];
        nock('https://' + common.DOMAIN)
          .put('/k/v1/record.json', (rqBody) => {
            expect(rqBody.record).toMatchObject(recordsData);
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
          .reply(200, { 'revision': '9' });
        const recordModule = new Record(conn);
        const updateRecordByIdResult = recordModule.updateRecordByID(appID, recordID, recordsData);
        return updateRecordByIdResult.then((rsp) => {
          expect(rsp.revision).toEqual('9');
        });
      });
      /**
       * Invalid data
       * The error will be displayed when there is one record has invalid data (text for number field)
       */
      it('[Record module-78] - should return the error in the result: The error will be displayed when there is one record has invalid data (text for number field)', () => {
        const recordID = 95;
        const appID = 22;
        const recordDataUpdate = {
          'app': 22,
          'id': 95,
          'revision': null,
          'record': {
            'title_event': {
              'value': 'Updated'
            },
            'Number': {
              'value': 'Updated'
            }
          }
        };
        const recordsData = [recordDataUpdate];
        const expectResult = {
          'code': 'CB_VA01',
          'id': '99aEZeyuk7LQObSKX9GA',
          'message': 'Missing or invalid input.',
          'errors': {
            'record[Number].value': {
              'messages': [
                'Only numbers are allowed.'
              ]
            }
          }
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/record.json`, (rqBody) => {
            expect(rqBody.record).toMatchObject(recordsData);
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
          .reply(400, expectResult);
        const recordModule = new Record(conn);
        const getRecordResult = recordModule.updateRecordByID(appID, recordID, recordsData);
        return getRecordResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
      /**
       * Invalid data
       * The error will be displayed when there is one record has invalid data (duplicate data for "prohibit duplicate value" field)
       */
      it('[Record module-79] - should return the error in the result: The error will be displayed when there is one record has invalid data (duplicate data for "prohibit duplicate value" field)', () => {
        const recordID = 95;
        const appID = 22;
        const recordDataUpdate = {
          'app': 22,
          'id': 95,
          'revision': null,
          'record': {
            'title_event': {
              'value': 'Updated'
            },
            'Number': {
              'value': '5'
            }
          }
        };
        const recordsData = [recordDataUpdate];
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'ESajpGXPYszubHfD5ov4',
          'message': 'Missing or invalid input.',
          'errors': {
            'record.Number.value': {
              'messages': [
                'This value already exists in another record.'
              ]
            }
          }
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/record.json`, (rqBody) => {
            expect(rqBody.record).toMatchObject(recordsData);
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
          .reply(400, expectResult);
        const recordModule = new Record(conn);
        const getRecordResult = recordModule.updateRecordByID(appID, recordID, recordsData);
        return getRecordResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });

      /**
       * Invalid data
       * The error will be displayed when there is one record has invalid data (exceed maximum for number field)
       */
      it('[Record module-80] - should return the error in the result: The error will be displayed when there is one record has invalid data (exceed maximum for number field)', () => {
        const recordID = 95;
        const appID = 22;
        const recordDataUpdate = {
          'app': 22,
          'id': 95,
          'revision': null,
          'record': {
            'title_event': {
              'value': 'Updated'
            },
            'Number': {
              'value': '51'
            }
          }
        };
        const recordsData = [recordDataUpdate];
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'rJQJJ6ByH0peJbdxOCcq',
          'message': 'Missing or invalid input.',
          'errors': {
            'record.Number.value': {
              'messages': [
                'The value must be 50 or less.'
              ]
            }
          }
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/record.json`, (rqBody) => {
            expect(rqBody.record).toMatchObject(recordsData);
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
          .reply(400, expectResult);
        const recordModule = new Record(conn);
        const getRecordResult = recordModule.updateRecordByID(appID, recordID, recordsData);
        return getRecordResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
  });
});