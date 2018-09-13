
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

const recordModule = new Record(conn);

describe('addRecords function', () => {
  describe('common case', () => {

    it('should return a promise', () => {
      nock('https://' + common.DOMAIN)
        .post('/k/v1/records.json')
        .reply(200, {
          'ids': ['1'],
          'revisions': ['1']
        });
      const addRecordsResult = recordModule.addRecords();
      expect(addRecordsResult).toHaveProperty('then');
      expect(addRecordsResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('valid data', () => {
      it('[Record-46] should add successfully the record', () => {
        const data = {
          app: 1,
          records: [{Text_0: {value: 1}}, {Text_0: {value: 2}}]
        };

        nock('https://' + common.DOMAIN)
          .post('/k/v1/records.json', (rqBody) => {
            expect(rqBody.records).toEqual(expect.arrayContaining(data.records));
            return rqBody.app === data.app;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, {
            'ids': ['1', '2'],
            'revisions': ['1', '1']
          });

        const addRecordsResult = recordModule.addRecords(data.app, data.records);
        return addRecordsResult.then((rsp) => {
          expect(rsp).toHaveProperty('ids');
          expect(rsp.revisions).toEqual(expect.arrayContaining(['1', '1']));
        });
      });
    });

    describe('Data table', () => {
      it('[Record-56] the data for record with table is added successfully', () => {
        const data = {
          app: 1,
          records: [
            {
              Text: {
                value: 'test1'
              },
              User_select: {
                value: [
                  {
                    code: 'john-d'
                  }
                ]
              },
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
            },
            {
              Text: {
                value: 'test2'
              },
              User_select: {
                value: [
                  {
                    code: 'jane-r'
                  }
                ]
              }
            }
          ]
        };

        nock('https://' + common.DOMAIN)
          .post('/k/v1/records.json', (rqBody) => {
            expect(rqBody.records).toEqual(expect.arrayContaining(data.records));
            return rqBody.app === data.app;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, {
            'ids': ['1', '2'],
            'revisions': ['1', '1']
          });

        const addRecordsResult = recordModule.addRecords(data.app, data.records);
        return addRecordsResult.then((rsp) => {
          expect(rsp).toHaveProperty('ids');
          expect(rsp.revisions).toEqual(expect.arrayContaining(['1', '1']));
        });
      });
    });

    describe('Guest Space', () => {
      it('[Record-57] the records are added successfully for app in guest space', () => {
        const data = {
          app: 1,
          records: [{Text_0: {value: 1}}, {Text_0: {value: 2}}]
        };

        nock('https://' + common.DOMAIN)
          .post('/k/guest/1/v1/records.json', (rqBody) => {
            expect(rqBody.records).toEqual(expect.arrayContaining(data.records));
            return rqBody.app === data.app;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, {
            'ids': ['1', '2'],
            'revisions': ['1', '1']
          });
        const conn1 = new Connection(common.DOMAIN, auth, common.GUEST_SPACEID);
        const recordsModule = new Record(conn1);
        const addRecordsResult = recordsModule.addRecords(data.app, data.records);
        return addRecordsResult.then((rsp) => {
          expect(rsp).toHaveProperty('ids');
          expect(rsp.revisions).toEqual(expect.arrayContaining(['1', '1']));
        });
      });
    });
  });

  describe('error', () => {
    describe('invalid app ID', () => {
      it('[Record-47] should return an error when using unexisted appID', () => {
        const data = {
          unexistedAppID: 999,
          records: [{Text_0: {value: 1}}, {Text_0: {value: 2}}]
        };
        nock('https://' + common.DOMAIN)
          .post('/k/v1/records.json', (rqBody) => {
            expect(rqBody.app).toEqual(data.unexistedAppID);
            return true;
          })
          .reply(404, {'code': 'GAIA_AP01', 'id': 'Jt2jVNMHlZxXPufVeZCz', 'message': 'The app (ID: 999) not found. The app may have been deleted.'});

        const addRecordsResult = recordModule.addRecords(data.unexistedAppID, data.records);
        return addRecordsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
        });
      });

      it('[Record-47] should return error when using negative appID', () => {
        const data = {
          negativeAppID: 999,
          records: [{Text_0: {value: 1}}, {Text_0: {value: 2}}]
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'PmcT6fVjQMsl4BhMw9Uo',
          'message': 'Missing or invalid input.',
          'errors': {'app': {'messages': ['must be greater than or equal to 1']}}
        };
        nock('https://' + common.DOMAIN)
          .post('/k/v1/records.json', (rqBody) => {
            expect(rqBody.app).toEqual(data.negativeAppID);
            return true;
          })
          .reply(400, expectResult);

        const addRecordsResult = recordModule.addRecords(data.negativeAppID, data.records);
        return addRecordsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });

      it('[Record-47] should return error when appID is 0', () => {
        const data = {
          appID: 0,
          records: [{Text_0: {value: 1}}, {Text_0: {value: 2}}]
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'PmcT6fVjQMsl4BhMw9Uo',
          'message': 'Missing or invalid input.',
          'errors': {'app': {'messages': ['must be greater than or equal to 1']}}
        };
        nock('https://' + common.DOMAIN)
          .post('/k/v1/records.json', (rqBody) => {
            expect(rqBody.app).toEqual(0);
            return true;
          })
          .reply(400, expectResult);

        const addRecordsResult = recordModule.addRecords(data.appID, data.records);
        return addRecordsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });

    });

    describe('invalid data', () => {
      it('[Record-49] error will be displayed when adding invalid data (text for number field)', () => {
        const data = {
          app: 1,
          records: [{Number: {value: 'test'}}, {Text_0: {value: 2}}]
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
          .post('/k/v1/records.json', (rqBody) => {
            expect(rqBody.records).toEqual(expect.arrayContaining(data.records));
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
        const recordsModule = new Record(conn);
        return recordsModule.addRecords(data.app, data.records)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });

      it('[Record-50] error will be displayed when adding invalid data (duplicate data for "prohibit duplicate value" field)', () => {
        const data = {
          app: 1,
          records: [{Text_0: {value: 1}}, {Text_0: {value: 1}}]
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
          .post('/k/v1/records.json', (rqBody) => {
            expect(rqBody.records).toEqual(expect.arrayContaining(data.records));
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
        const recordsModule = new Record(conn);
        return recordsModule.addRecords(data.app, data.records)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });

      it('[Record-51] error will be displayed when adding invalid data (exceed maximum for number field)', () => {
        const data = {
          app: 1,
          records: [{Number: {value: 1000}}, {Text_0: {value: 1}}]
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': '0',
          'message': 'Missing or invalid input.',
          'errors': {
            'record[0].value': {
              'messages': [
                'The value must be 999 or less.'
              ]
            }
          }
        };

        nock('https://' + common.DOMAIN)
          .post('/k/v1/records.json', (rqBody) => {
            expect(rqBody.records).toEqual(expect.arrayContaining(data.records));
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
        const recordsModule = new Record(conn);
        return recordsModule.addRecords(data.app, data.records)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });
    });

    describe('missing required field', () => {
      it('[Record-52] should return error when using method without app ID', () => {
        const data = {
          records: [{Text_0: {value: 1}}, {Text_0: {value: 2}}]
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
        nock('https://' + common.DOMAIN, (rqBody) => {
          expect(rqBody).not.toHaveProperty('app');
          return true;
        })
          .post('/k/v1/records.json')
          .reply(400, expectResult);

        const recordsModule = new Record(conn);
        return recordsModule.addRecords(undefined, data.records)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });

      it('[Record-53] should return error when using method without data for required field', () => {
        const body = {
          app: 1,
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
        nock('https://' + common.DOMAIN, (rqBody) => {
          expect(rqBody).not.toHaveProperty('app');
          return true;
        })
          .post('/k/v1/records.json')
          .reply(400, expectResult);

        const recordsModule = new Record(conn);
        return recordsModule.addRecords(1, undefined)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });
    });

    describe('missing required data', () => {
      it('[Record-54] should return error when using method without data for required field', () => {
        const data = {
          app: 1,
          records: [{Text_0: {value: 'test'}}, {Text_0: {value: 2}}]
        };
        const expectResult = {
          'code': 'GAIA_AP01',
          'id': '0',
          'message': 'Missing or invalid input.',
          'errors': {
            'record.Text_1.value': {
              'messages': [
                'Required.'
              ]
            }
          }
        };
        nock('https://' + common.DOMAIN, (rqBody) => {
          expect(rqBody).not.toHaveProperty('app');
          return true;
        })
          .post('/k/v1/records.json')
          .reply(400, expectResult);

        const recordsModule = new Record(conn);
        return recordsModule.addRecords(data.app, data.records)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });
    });


  });
});
