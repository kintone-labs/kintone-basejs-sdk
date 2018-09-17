
/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require('nock');

const common = require('../../common');
const {KintoneAPIException, Connection, Auth, Record} = require(common.MAIN_PATH);

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

describe('addRecord function', () => {
  const URI = 'https://' + common.DOMAIN;
  const URL = '/k/v1/record.json';
  
  describe('common case', () => {
    it('should return a promise', () => {
      nock(URI)
        .post(URL)
        .reply(200, {'id': '100', 'revision': '1'});
      const recordModule = new Record(conn);
      const addRecordResult = recordModule.addRecord();
      expect(addRecordResult).toHaveProperty('then');
      expect(addRecordResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('valid Data', () => {
      const body = {
        app: 1,
        record: {
          Dropdown: {value: 1},
          Text: {value: 'test'},
          Number: {value: 1},
          Table: {
            value: [
              {
                value: {
                  Table_singletext: {
                    value: 'Chocolate Pudding'
                  }
                }
              }
            ]
          }
        }
      };

      it('[Record-27] should add successfully with full data', () => {
        nock(URI)
          .post(URL, (rqBody) => {
            expect(rqBody.record).toMatchObject(body.record);
            return rqBody.app === body.app;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toEqual(expect.stringContaining('application/json'));
            return true;
          })
          .reply(200, {'id': '100', 'revision': '1'});
        const recordModule = new Record(conn);
        return recordModule.addRecord(body.app, body.record)
          .then(rsp => {
            expect(rsp).toHaveProperty('id');
            expect(rsp).toHaveProperty('revision');
          });
      });

      it('[Record-38] the data for record with table is added successfully', () => {
        nock(URI)
          .post(URL, (rqBody) => {
            expect(rqBody.record).toMatchObject(body.record);
            expect(rqBody.record.Table).toMatchObject(body.record.Table);
            return rqBody.app === body.app;
          })
          .reply(200, {'id': '100', 'revision': '1'});
        const recordModule = new Record(conn);
        return recordModule.addRecord(body.app, body.record)
          .then(rsp => {
            expect(rsp).toHaveProperty('id');
            expect(rsp).toHaveProperty('revision');
          });
      });

      it('[Record-39] the record is added successfully for app in guest space', () => {
        nock(URI)
          .post('/k/guest/1/v1/record.json', (rqBody) => {
            expect(rqBody.record).toMatchObject(body.record);
            return rqBody.app === body.app;
          })
          .reply(200, {'id': '100', 'revision': '1'});
        const conn1 = new Connection(common.DOMAIN, auth, common.GUEST_SPACEID);
        const recordModule = new Record(conn1);
        return recordModule.addRecord(body.app, body.record)
          .then(rsp => {
            expect(rsp).toHaveProperty('id');
            expect(rsp).toHaveProperty('revision');
          });
      });

      it('[Record-45] the record is added for app without any fields is normally', () => {
        const bodyWithoutFields = {
          app: 1,
          record: {
          }
        };

        nock(URI)
          .post(URL, (rqBody) => {
            expect(rqBody.record).toMatchObject(bodyWithoutFields.record);
            return rqBody.app === bodyWithoutFields.app;
          })
          .reply(200, {'id': '100', 'revision': '1'});
        const recordModule = new Record(conn);
        return recordModule.addRecord(bodyWithoutFields.app, bodyWithoutFields.record)
          .then(rsp => {
            expect(rsp).toHaveProperty('id');
            expect(rsp).toHaveProperty('revision');
          });
      });

      it('[Record-44] the record is added executing with ID as string type (input string for interger)', () => {
        const bodyStringID = {
          app: '1',
          record: {
            Dropdown: {value: 1},
            Text: {value: 'test'},
          }
        };
        nock(URI)
          .post(URL, (rqBody) => {
            expect(rqBody.record).toMatchObject(bodyStringID.record);
            return rqBody.app === bodyStringID.app;
          })
          .reply(200, {'id': '100', 'revision': '1'});
        const recordModule = new Record(conn);
        return recordModule.addRecord(bodyStringID.app, bodyStringID.record)
          .then(rsp => {
            expect(rsp).toHaveProperty('id');
            expect(rsp).toHaveProperty('revision');
          });
      });
    });

    describe('required field', () => {
      it('[Record-35] record with blank data is added when using method without record data', () => {
        const body = {
          app: 1,
          record: {}
        };
        nock(URI)
          .post(URL, (rqBody) => {
            expect(rqBody.record).toMatchObject(body.record);
            return rqBody.app === body.app;
          })
          .reply(200, {'id': '100', 'revision': '1'});
        const recordModule = new Record(conn);
        return recordModule.addRecord(body.app, body.record)
          .then(rsp => {
            expect(rsp).toHaveProperty('id');
            expect(rsp).toHaveProperty('revision');
          });
      });
    });
  });

  describe('error case', () => {
    describe('invalid app', () => {
      it('[Record-28] should return error when using unexisted app', () => {
        const unexistedapp = 999;
        const expectResult = {
          'code': 'GAIA_AP01',
          'id': 'id when request to invalid app',
          'message': 'The app (ID: 999) not found. The app may have been deleted.'
        };
        nock(URI, (rqBody) => {
          expect(rqBody.app).toEqual(unexistedapp);
          return true;
        })
          .post(URL)
          .reply(404, expectResult);

        const recordModule = new Record(conn);
        return recordModule.addRecord(unexistedapp)
          .catch(err => {
            expect(err.get()).toHaveProperty('id');
            expect(err.get().code).toEqual(expectResult.code);
            expect(err.get().message).toEqual(expectResult.message);
          });
      });
      it('[Record-28] should return error when using negative app', () => {
        const negativeapp = -1;
        const expectResult = {
          'code': 'CB_VA01',
          'id': '0hjc1OJbmY29cl2SoDey',
          'message': 'Missing or invalid input.',
          'errors': {
            'app':
            {
              'messages': ['must be greater than or equal to 1']
            }
          }
        };
        nock(URI)
          .post(URL)
          .reply(400, expectResult);

        const recordModule = new Record(conn);
        return recordModule.addRecord(negativeapp)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });
      it('[Record-28] should return error when app is 0', () => {
        const app = 0;
        const expectResult = {
          'code': 'CB_VA01',
          'id': '0hjc1OJbmY29cl2SoDey',
          'message': 'Missing or invalid input.',
          'errors': {
            'app':
            {
              'messages': ['must be greater than or equal to 1']
            }
          }
        };
        nock(URI)
          .post(URL)
          .reply(400, expectResult);

        const recordModule = new Record(conn);
        return recordModule.addRecord(app)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });
    });

    describe('invalid data', () => {
      it('[Record-30] error will be displayed when adding invalid data (text for number field)', () => {
        const body = {
          app: 1,
          record: {
            Number: {value: 'test'}
          }
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': '0',
          'message': 'Missing or invalid input.',
          'errors': {
            'record[Number].value': {
              'messages': [
                'Only numbers are allowed.'
              ]
            }
          }
        };

        nock(URI)
          .post(URL, (rqBody) => {
            expect(rqBody.record).toMatchObject(body.record);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toEqual(expect.stringContaining('application/json'));
            return true;
          })
          .reply(400, expectResult);
        const recordModule = new Record(conn);
        return recordModule.addRecord(body.app, body.record)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });

      it('[Record-31] error will be displayed when adding invalid data (duplicate data for "prohibit duplicate value" field)', () => {
        const body = {
          app: 1,
          record: {
            Number: {value: 1}
          }
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': '0',
          'message': 'Missing or invalid input.',
          'errors': {
            'record[Number].value': {
              'messages': [
                'This value already exists in another record.'
              ]
            }
          }
        };

        nock(URI)
          .post(URL, (rqBody) => {
            expect(rqBody.record).toMatchObject(body.record);
            return true;
          })
          .reply(400, expectResult);
        const recordModule = new Record(conn);
        return recordModule.addRecord(body.app, body.record)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });

      it('[Record-32] error will be displayed when adding invalid data (exceed maximum for number field)', () => {
        const body = {
          app: 1,
          record: {
            Number: {value: 1000}
          }
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': '0',
          'message': 'Missing or invalid input.',
          'errors': {
            'record[Number].value': {
              'messages': [
                'The value must be 999 or less.'
              ]
            }
          }
        };

        nock(URI)
          .post(URL, (rqBody) => {
            expect(rqBody.record).toMatchObject(body.record);
            return true;
          })
          .reply(400, expectResult);
        const recordModule = new Record(conn);
        return recordModule.addRecord(body.app, body.record)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });

      it('[Record-33] error will be displayed when adding data for cannot-update field', () => {
        const body = {
          app: 1,
          record: {
            Calculated: {value: 1000}
          }
        };
        const expectResult = {
          'code': 'CB_IJ01',
          'id': '0',
          'message': 'Invalid JSON string.'
        };

        nock(URI)
          .post(URL, (rqBody) => {
            expect(rqBody.record).toMatchObject(body.record);
            return true;
          })
          .reply(400, expectResult);
        const recordModule = new Record(conn);
        return recordModule.addRecord(body.app, body.record)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });
    });

    describe('missing required field', () => {
      it('[Record-34] should return error when using method without app ID', () => {
        const body = {
          app: 1,
          record: {
            Text: {value: 'test'}
          }
        };
        const expectResult = {
          'code': 'GAIA_AP01',
          'id': '0',
          'message': 'Missing or invalid input.',
          'errors': {
            'record.RequiredField.value': {
              'messages': [
                'Required.'
              ]
            }
          }
        };
        nock(URI, (rqBody) => {
          expect(rqBody).not.toHaveProperty('app');
          return true;
        })
          .post(URL)
          .reply(400, expectResult);

        const recordModule = new Record(conn);
        return recordModule.addRecord(undefined, body.record)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });

      it('[Record-35] should return error when using method without data for required field', () => {
        const body = {
          app: 1,
          record: {}
        };
        const expectResult = {
          'code': 'GAIA_AP01',
          'id': '0',
          'message': 'Missing or invalid input.',
          'errors': {
            'messages': [
              'Required.'
            ]
          }
        };
        nock(URI, (rqBody) => {
          expect(rqBody.record).toMatchObject(body.record);
          return true;
        })
          .post(URL)
          .reply(400, expectResult);

        const recordModule = new Record(conn);
        return recordModule.addRecord(body.app, undefined)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });
    });

    describe('missing required field', () => {
      it('[Record-36] should return error when using method without data for required field', () => {
        const body = {
          app: 1,
          record: {
            Text: {value: 'test'}
          }
        };
        const expectResult = {
          'code': 'GAIA_AP01',
          'id': '0',
          'message': 'Missing or invalid input.',
          'errors': {
            'record.Number.value': {
              'messages': [
                'Required.'
              ]
            }
          }
        };
        nock(URI, (rqBody) => {
          expect(rqBody.record).toMatchObject(body.record);
          return true;
        })
          .post(URL)
          .reply(400, expectResult);

        const recordModule = new Record(conn);
        return recordModule.addRecord(body.app, body.record)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });
    });

    describe('permission', () => {
      it('[Record-41] error will be displayed when user does not have Add records permission for app', () => {
        const body = {
          app: 1,
          record: {
            Number: {value: 'test'}
          }
        };
        const expectResult = {
          'code': 'CB_NO02',
          'id': '0',
          'message': 'No privilege to proceed.'
        };

        nock(URI)
          .post(URL, (rqBody) => {
            expect(rqBody.record).toMatchObject(body.record);
            return true;
          })
          .reply(400, expectResult);
        const recordModule = new Record(conn);
        return recordModule.addRecord(body.app, body.record)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });
    });
  });
});