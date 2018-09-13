
/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require('nock');

const common = require('../../common');
const {KintoneException, Connection, Auth, Record} = require(common.MAIN_PATH);

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

describe('addRecord function', () => {
  describe('common case', () => {
    it('should return a promise', () => {
      nock('https://' + common.DOMAIN)
        .post('/k/v1/record.json')
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
        appID: 1,
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
        nock('https://' + common.DOMAIN)
          .post('/k/v1/record.json', (rqBody) => {
            expect(rqBody.record).toMatchObject(body.record);
            return rqBody.app === body.appID;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, {'id': '100', 'revision': '1'});
        const recordModule = new Record(conn);
        return recordModule.addRecord(body.appID, body.record)
          .then(rsp => {
            expect(rsp).toHaveProperty('id');
            expect(rsp).toHaveProperty('revision');
          });
      });

      it('[Record-38] the data for record with table is added successfully', () => {
        nock('https://' + common.DOMAIN)
          .post('/k/v1/record.json', (rqBody) => {
            expect(rqBody.record).toMatchObject(body.record);
            expect(rqBody.record.Table).toMatchObject(body.record.Table);
            return rqBody.app === body.appID;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, {'id': '100', 'revision': '1'});
        const recordModule = new Record(conn);
        return recordModule.addRecord(body.appID, body.record)
          .then(rsp => {
            expect(rsp).toHaveProperty('id');
            expect(rsp).toHaveProperty('revision');
          });
      });

      it('[Record-39] the record is added successfully for app in guest space', () => {
        nock('https://' + common.DOMAIN)
          .post('/k/guest/1/v1/record.json', (rqBody) => {
            expect(rqBody.record).toMatchObject(body.record);
            return rqBody.app === body.appID;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, {'id': '100', 'revision': '1'});
        const conn1 = new Connection(common.DOMAIN, auth, common.GUEST_SPACEID);
        const recordModule = new Record(conn1);
        return recordModule.addRecord(body.appID, body.record)
          .then(rsp => {
            expect(rsp).toHaveProperty('id');
            expect(rsp).toHaveProperty('revision');
          });
      });

      it('[Record-45] the record is added for app without any fields is normally', () => {
        const bodyWithoutFields = {
          appID: 1,
          record: {
          }
        };

        nock('https://' + common.DOMAIN)
          .post('/k/v1/record.json', (rqBody) => {
            expect(rqBody.record).toMatchObject(bodyWithoutFields.record);
            return rqBody.app === bodyWithoutFields.appID;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, {'id': '100', 'revision': '1'});
        const recordModule = new Record(conn);
        return recordModule.addRecord(bodyWithoutFields.appID, bodyWithoutFields.record)
          .then(rsp => {
            expect(rsp).toHaveProperty('id');
            expect(rsp).toHaveProperty('revision');
          });
      });

      it('[Record-44] the record is added executing with ID as string type (input string for interger)', () => {
        const bodyStringID = {
          appID: '1',
          record: {
            Dropdown: {value: 1},
            Text: {value: 'test'},
          }
        };
        nock('https://' + common.DOMAIN)
          .post('/k/v1/record.json', (rqBody) => {
            expect(rqBody.record).toMatchObject(bodyStringID.record);
            return rqBody.app === bodyStringID.appID;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, {'id': '100', 'revision': '1'});
        const recordModule = new Record(conn);
        return recordModule.addRecord(bodyStringID.appID, bodyStringID.record)
          .then(rsp => {
            expect(rsp).toHaveProperty('id');
            expect(rsp).toHaveProperty('revision');
          });
      });
    });

    describe('required field', () => {
      it('[Record-35] record with blank data is added when using method without record data', () => {
        const body = {
          appID: 1,
          record: {}
        };
        nock('https://' + common.DOMAIN)
          .post('/k/v1/record.json', (rqBody) => {
            expect(rqBody.record).toMatchObject(body.record);
            return rqBody.app === body.appID;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, {'id': '100', 'revision': '1'});
        const recordModule = new Record(conn);
        return recordModule.addRecord(body.appID, body.record)
          .then(rsp => {
            expect(rsp).toHaveProperty('id');
            expect(rsp).toHaveProperty('revision');
          });
      });
    });
  });

  describe('error case', () => {
    describe('invalid appID', () => {
      it('[Record-28] should return error when using unexisted appID', () => {
        const unexistedAppID = 999;
        const expectResult = {
          'code': 'GAIA_AP01',
          'id': 'id when request to invalid app',
          'message': 'The app (ID: 999) not found. The app may have been deleted.'
        };
        nock('https://' + common.DOMAIN, (rqBody) => {
          expect(rqBody.app).toEqual(unexistedAppID);
          return true;
        })
          .post('/k/v1/record.json')
          .reply(404, expectResult);

        const recordModule = new Record(conn);
        return recordModule.addRecord(unexistedAppID)
          .catch(err => {
            expect(err.get()).toHaveProperty('id');
            expect(err.get().code).toEqual(expectResult.code);
            expect(err.get().message).toEqual(expectResult.message);
          });
      });
      it('[Record-28] should return error when using negative appID', () => {
        const negativeAppID = -1;
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
        nock('https://' + common.DOMAIN)
          .post('/k/v1/record.json')
          .reply(400, expectResult);

        const recordModule = new Record(conn);
        return recordModule.addRecord(negativeAppID)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });
      it('[Record-28] should return error when appID is 0', () => {
        const appID = 0;
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
        nock('https://' + common.DOMAIN)
          .post('/k/v1/record.json')
          .reply(400, expectResult);

        const recordModule = new Record(conn);
        return recordModule.addRecord(appID)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });
    });

    describe('invalid data', () => {
      it('[Record-30] error will be displayed when adding invalid data (text for number field)', () => {
        const body = {
          appID: 1,
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

        nock('https://' + common.DOMAIN)
          .post('/k/v1/record.json', (rqBody) => {
            expect(rqBody.record).toMatchObject(body.record);
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
        return recordModule.addRecord(body.appID, body.record)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });

      it('[Record-31] error will be displayed when adding invalid data (duplicate data for "prohibit duplicate value" field)', () => {
        const body = {
          appID: 1,
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

        nock('https://' + common.DOMAIN)
          .post('/k/v1/record.json', (rqBody) => {
            expect(rqBody.record).toMatchObject(body.record);
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
        return recordModule.addRecord(body.appID, body.record)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });

      it('[Record-32] error will be displayed when adding invalid data (exceed maximum for number field)', () => {
        const body = {
          appID: 1,
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

        nock('https://' + common.DOMAIN)
          .post('/k/v1/record.json', (rqBody) => {
            expect(rqBody.record).toMatchObject(body.record);
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
        return recordModule.addRecord(body.appID, body.record)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });

      it('[Record-33] error will be displayed when adding data for cannot-update field', () => {
        const body = {
          appID: 1,
          record: {
            Calculated: {value: 1000}
          }
        };
        const expectResult = {
          'code': 'CB_IJ01',
          'id': '0',
          'message': 'Invalid JSON string.'
        };

        nock('https://' + common.DOMAIN)
          .post('/k/v1/record.json', (rqBody) => {
            expect(rqBody.record).toMatchObject(body.record);
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
        return recordModule.addRecord(body.appID, body.record)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });
    });

    describe('missing required field', () => {
      it('[Record-34] should return error when using method without app ID', () => {
        const body = {
          appID: 1,
          record: {
            Text: {value: 'test'}
          }
        };
        const expectResult = {
          'code': 'GAIA_AP01',
          'id': '0',
          'message': 'Missing or invalid input.'
        };
        nock('https://' + common.DOMAIN, (rqBody) => {
          expect(rqBody).not.toHaveProperty('app');
          return true;
        })
          .post('/k/v1/record.json')
          .reply(400, expectResult);

        const recordModule = new Record(conn);
        return recordModule.addRecord('', body.record)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });

      it('[Record-36] should return error when using method without data for required field', () => {
        const body = {
          appID: 1,
          record: {}
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
        nock('https://' + common.DOMAIN, (rqBody) => {
          expect(rqBody.record).toMatchObject(body.record);
          return true;
        })
          .post('/k/v1/record.json')
          .reply(400, expectResult);

        const recordModule = new Record(conn);
        return recordModule.addRecord('', body.record)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });
    });

    describe('permission', () => {
      it('[Record-41] error will be displayed when user does not have Add records permission for app', () => {
        const body = {
          appID: 1,
          record: {
            Number: {value: 'test'}
          }
        };
        const expectResult = {
          'code': 'CB_NO02',
          'id': '0',
          'message': 'No privilege to proceed.'
        };

        nock('https://' + common.DOMAIN)
          .post('/k/v1/record.json', (rqBody) => {
            expect(rqBody.record).toMatchObject(body.record);
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
        return recordModule.addRecord(body.appID, body.record)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });
    });
  });
});