
/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require('nock');

const common = require('../../utils/common');

const KintoneAPIException = require('../../../src/exception/KintoneAPIException');
const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const Record = require('../../../src/module/record/Record');

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

describe('updateRecords function', () => {
  describe('common case', () => {
    const appID = 1;
    const recordDataUpdate = {
      id: 1,
      record: {
        Text_0: 'test'
      },
      revision: 2
    };
    const recordsData = [recordDataUpdate];

    it('[Record module-0-common] - should return a promise', () => {
      nock('https://' + common.DOMAIN)
        .put('/k/v1/records.json')
        .reply(200, {
          'records': [{
            id: 1,
            revision: 3
          }]
        });

      const recordModule = new Record(conn);
      const updateRecordsResult = recordModule.updateRecords(appID, recordsData);
      expect(updateRecordsResult).toHaveProperty('then');
      expect(updateRecordsResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('valid data', () => {
      it('[Record module-107] - should update successfully the records', () => {
        const appID = 1;
        const recordDataUpdate = {
          id: 1,
          record: {
            Text_0: 'test'
          },
          revision: 2
        };
        const recordsData = [recordDataUpdate];
        const expectResult = {
          'records': [{
            id: 1,
            revision: 3
          }]
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/records.json', (rqBody) => {
            expect(rqBody.app).toEqual(appID);
            expect(rqBody.records).toMatchObject(recordsData);
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
        const updateRecordsResult = recordModule.updateRecords(appID, recordsData);
        return updateRecordsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    /**
     * valid data by keyfield
     * The records are updated successfully, the revision is increased by 1 after update
     */
    it('[Record module-108] - should update successfully the record', () => {
      const appID = 777;
      const data = {
        'app': appID,
        'records': [
          {
            'updateKey': {
              'field': 'unique_key',
              'value': 'CODE123'
            },
            'revision': 4,
            'record': {
              'string_1': {
                'value': 'Silver plates'
              }
            }
          },
          {
            'updateKey': {
              'field': 'unique_key',
              'value': 'CODE456'
            },
            'revision': 1,
            'record': {
              'string_multi': {
                'value': 'The quick brown fox.'
              }
            }
          }
        ]
      };
      const recordsData = [data];
      const expectResult = {
        'records': [
          {
            'id': '95',
            'revision': '10'
          },
          {
            'id': '96',
            'revision': '3'
          }
        ]
      };
      nock('https://' + common.DOMAIN)
        .put('/k/v1/records.json', (rqBody) => {
          expect(rqBody.records).toMatchObject(recordsData);
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
      const updateRecordsResult = recordModule.updateRecords(appID, recordsData);
      return updateRecordsResult.then((rsp) => {
        expect(rsp).toMatchObject(expectResult);
      });
    });

    /**
     * revision = -1
     */
    it('[Record module-109] - should update successfully the record when revision = -1', () => {
      const appID = 777;
      const data = {
        'app': appID,
        'records': [
          {
            'id': 1,
            'revision': 4,
            'record': {
              'string_1': {
                'value': 'Silver plates'
              }
            }
          },
          {
            'id': 2,
            'revision': 1,
            'record': {
              'string_multi': {
                'value': 'The quick brown fox.'
              }
            }
          }
        ]
      };
      const recordsData = [data];
      const expectResult = {
        'records': [
          {
            'id': '95',
            'revision': '10'
          },
          {
            'id': '96',
            'revision': '3'
          }
        ]
      };
      nock('https://' + common.DOMAIN)
        .put('/k/v1/records.json', (rqBody) => {
          expect(rqBody.records).toMatchObject(recordsData);
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
      const updateRecordsResult = recordModule.updateRecords(appID, recordsData);
      return updateRecordsResult.then((rsp) => {
        expect(rsp).toMatchObject(expectResult);
      });
    });
    /**
       * Data table
       * Verify the data for record with table is added successfully
       */
    it('[Record module-124] - Verify the data for record with table is added successfully', () => {
      const appID = 19;
      const recordDataUpdate = {
        'app': appID,
        'records': [
          {
            'id': 1,
            'revision': 4,
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
          },
          {
            'id': 2,
            'revision': 1,
            'record': {
              'Number': {
                'value': '59'
              }
            }
          }
        ]
      };
      const recordsData = [recordDataUpdate];
      nock('https://' + common.DOMAIN)
        .put('/k/v1/records.json', (rqBody) => {
          expect(rqBody.records).toMatchObject(recordsData);
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
        .reply(200, {'revision': '2'});

      const recordModule = new Record(conn);
      const updateRecordByIdResult = recordModule.updateRecords(appID, recordsData);
      return updateRecordByIdResult.then((rsp) => {
        expect(rsp.revision).toEqual('2');
      });
    });

    /**
     * Guest space
     * The record is updated successfully for app in guest space
     */
    it('[Record module-125] - should update record successfully for app in guest space', () => {
      const connGuestSpace = new Connection(common.DOMAIN, auth, common.GUEST_SPACEID);
      const appID = 19;
      const recordDataUpdate = {
        'app': appID,
        'records': [
          {
            'id': 1,
            'revision': 4,
            'record': {
              'string_1': {
                'value': 'Silver plates'
              }
            }
          },
          {
            'id': 2,
            'revision': 1,
            'record': {
              'Number': {
                'value': '59'
              }
            }
          }
        ]
      };
      const recordsData = [recordDataUpdate];
      nock('https://' + common.DOMAIN)
        .put('/k/v1/records.json', (rqBody) => {
          expect(rqBody.records).toMatchObject(recordsData);
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
        .reply(200, {'revision': '3'});

      const recordModule = new Record(connGuestSpace);
      const updateRecordByIdResult = recordModule.updateRecords(appID, recordsData);
      return updateRecordByIdResult.then((rsp) => {
        expect(rsp.revision).toEqual('3');
      });
    });

    /**
     * Invalid input type
     * The function still work correctly when executing with interger as string type (input string for interger and vice versa)
     */
    it('[Record module-126] - should update record successfully when executing with interger as string type (input string for interger and vice versa) ', () => {
      const appID = '19';
      const recordDataUpdate = {
        'app': appID,
        'records': [
          {
            'id': 1,
            'revision': 4,
            'record': {
              'string_1': {
                'value': 'Silver plates'
              }
            }
          },
          {
            'id': 2,
            'revision': 1,
            'record': {
              'Number': {
                'value': '59'
              }
            }
          }
        ]
      };
      const recordsData = [recordDataUpdate];
      nock('https://' + common.DOMAIN)
        .put('/k/v1/records.json', (rqBody) => {
          expect(rqBody.records).toMatchObject(recordsData);
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
        .reply(200, {'revision': '4'});

      const recordModule = new Record(conn);
      const updateRecordByIdResult = recordModule.updateRecords(appID, recordsData);
      return updateRecordByIdResult.then((rsp) => {
        expect(rsp.revision).toEqual('4');
      });
    });


    describe('error case', () => {
      describe('wrong revision', () => {
        it('[Record module-110] - should return error when using wrong revison', () => {
          const appID = 1;
          const recordDataUpdate = {
            id: 1,
            record: {
              Text_0: 'test'
            },
            revision: 0
          };
          const recordsData = [recordDataUpdate];
          const expectResult = {
            'code': 'GAIA_CO02',
            'id': '4ucJiURAv0LsXBkLCDdi',
            'message': 'The revision is not the latest. Someone may update a record.'
          };
          nock('https://' + common.DOMAIN)
            .put('/k/v1/records.json', (rqBody) => {
              expect(rqBody.records).toMatchObject(recordsData);
              return true;
            })
            .reply(409, expectResult);
          const recordModule = new Record(conn);
          return recordModule.updateRecords(appID, recordsData).catch((err) => {
            expect(err.get()).toMatchObject(expectResult);
          });
        });
      });
      /**
      * Todo: implement another case error
      */
      /**
    * Update data system field
    * Error is displayed when updating these fields:
    *  Created by
    *  Updated by
    *  Created datetime
    *  Updated datetime
    */
      it('[Record module-111] - should return the error in the result: Error is displayed when updating these fields:' +
        'Created by' +
        'Updated by' +
        'Created datetime' +
        'Updated datetime', () => {
        const appID = 777;
        const data = {
          'app': appID,
          'records': [
            {
              'updateKey': {
                'field': 'unique_key',
                'value': 'CODE123'
              },
              'revision': null,
              'record': {
                'Updated_by': {
                  'value': 'Silver plates'
                }
              }
            },
            {
              'updateKey': {
                'field': 'unique_key',
                'value': 'CODE456'
              },
              'revision': null,
              'record': {
                'string_multi': {
                  'value': 'The quick brown fox.'
                }
              }
            }
          ]
        };
        const recordsData = [data];
        const expectResult = {
          'code': 'CB_IJ01',
          'id': 'KySHqaEs9dbE8o6gbZG6',
          'message': 'Invalid JSON string.'
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/records.json`, (rqBody) => {
            expect(rqBody.records).toMatchObject(recordsData);
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
        const getRecordResult = recordModule.updateRecords(appID, recordsData);
        return getRecordResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
      /**
       * Permission
       * Error happens when user does not have Edit permission for app
       */
      it('[Record module-112] - should return the error in the result: Error happens when user does not have Edit permission for app', () => {
        const appID = 777;
        const data = {
          'app': appID,
          'records': [
            {
              'updateKey': {
                'field': 'unique_key',
                'value': 'CODE123'
              },
              'revision': null,
              'record': {
                'Updated_by': {
                  'value': 'Silver plates'
                }
              }
            },
            {
              'updateKey': {
                'field': 'unique_key',
                'value': 'CODE456'
              },
              'revision': null,
              'record': {
                'title_event': {
                  'value': 'The quick brown fox.'
                }
              }
            }
          ]
        };
        const recordsData = [data];

        const expectResult = {
          'code': 'CB_NO02',
          'id': 'M00VPaOdPEmu4kNlBawh',
          'message': 'No privilege to proceed.'
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/records.json`, (rqBody) => {
            expect(rqBody.records).toMatchObject(recordsData);
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
        const getRecordResult = recordModule.updateRecords(appID, recordsData);
        return getRecordResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });

      /**
       * Permission
       * Error happens when user does not have Edit permission for record
       */
      it('[Record module-113] - should return the error in the result: Error happens when user does not have Edit permission for record', () => {
        const appID = 777;
        const data = {
          'app': appID,
          'records': [
            {
              'updateKey': {
                'field': 'unique_key',
                'value': 'CODE123'
              },
              'revision': null,
              'record': {
                'Updated_by': {
                  'value': 'Silver plates'
                }
              }
            },
            {
              'updateKey': {
                'field': 'unique_key',
                'value': 'CODE456'
              },
              'revision': null,
              'record': {
                'title_event': {
                  'value': 'The quick brown fox.'
                }
              }
            }
          ]
        };
        const recordsData = [data];

        const expectResult = {
          'code': 'CB_NO02',
          'id': 'M00VPaOdPEmu4kNlBawh',
          'message': 'No privilege to proceed.'
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/records.json`, (rqBody) => {
            expect(rqBody.records).toMatchObject(recordsData);
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
        const getRecordResult = recordModule.updateRecords(appID, recordsData);
        return getRecordResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });

      /**
       * Permission
       * Error happens when user does not have Edit permission for field
       */
      it('[Record module-114] - should return the error in the result: Error happens when user does not have Edit permission for field', () => {
        const appID = 777;
        const data = {
          'app': appID,
          'records': [
            {
              'updateKey': {
                'field': 'unique_key',
                'value': 'CODE123'
              },
              'revision': null,
              'record': {
                'Updated_by': {
                  'value': 'Silver plates'
                }
              }
            },
            {
              'updateKey': {
                'field': 'unique_key',
                'value': 'CODE456'
              },
              'revision': null,
              'record': {
                'title_event': {
                  'value': 'The quick brown fox.'
                }
              }
            }
          ]
        };
        const recordsData = [data];
        const expectResult = {
          'code': 'GAIA_FU01',
          'id': 'xnADSZe3pmfqNwkVtmsg',
          'message': 'Edit permissions are required to edit field "title_event".'
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/records.json`, (rqBody) => {
            expect(rqBody.records).toMatchObject(recordsData);
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
        const getRecordResult = recordModule.updateRecords(appID, recordsData);
        return getRecordResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
      /**
       * Invalid app ID
       * The error will be displayed when using invalid app ID (unexisted, negative number, 0)
       */
      it('[Record module-115] - should return the error in the result: The error will be displayed when using invalid app ID (unexisted, negative number, 0)', () => {
        const appID = -220;
        const recordDataUpdate = {
          'app': appID,
          'records': [
            {
              'id': 1,
              'revision': 4,
              'record': {
                'string_1': {
                  'value': 'Silver plates'
                }
              }
            },
            {
              'id': 2,
              'revision': 1,
              'record': {
                'string_multi': {
                  'value': 'The quick brown fox.'
                }
              }
            }
          ]
        };
        const recordsData = [recordDataUpdate];
        const expectResult = {
          'code': 'GAIA_AP01',
          'id': 'F1m5aSXHdHNEWxY9gZdS',
          'message': 'The app (ID: 220) not found. The app may have been deleted.'
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/records.json`, (rqBody) => {
            expect(rqBody.records).toMatchObject(recordsData);
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
        const getRecordResult = recordModule.updateRecords(appID, recordsData);
        return getRecordResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
      /**
      * Missing required field
      * The error will be displayed when using method without app ID
      */
      it('[Record module-116] - should return the error in the result: The error will be displayed when using invalid record ID (unexisted, negative number, 0)', () => {
        const appID = null;
        const recordDataUpdate = {
          'app': appID,
          'records': [
            {
              'id': 1,
              'revision': 4,
              'record': {
                'string_1': {
                  'value': 'Silver plates'
                }
              }
            },
            {
              'id': 2,
              'revision': 1,
              'record': {
                'string_multi': {
                  'value': 'The quick brown fox.'
                }
              }
            }
          ]
        };
        const recordsData = [recordDataUpdate];
        const expectResult = {
          'code': 'CB_IJ01',
          'id': '2EvqyBpppiTZP4wQfPtx',
          'message': 'Invalid JSON string.'
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/records.json`, (rqBody) => {
            expect(rqBody.records).toMatchObject(recordsData);
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
        const getRecordResult = recordModule.updateRecords(appID, recordsData);
        return getRecordResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
      /**
      * Missing required field
      * Revision is increased by 1, no data is updated when using method without records data
      */
      it('[Record module-117] - should return revision and increased by 1, no data updated', () => {
        const appID = 22;
        const recordDataUpdate = {
          'app': appID,
          'records': [
          ]
        };
        const recordsData = [recordDataUpdate];
        nock('https://' + common.DOMAIN)
          .put('/k/v1/records.json', (rqBody) => {
            expect(rqBody.records).toMatchObject(recordsData);
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
          .reply(200, {'revision': '7'});

        const recordModule = new Record(conn);
        const updateRecordByIdResult = recordModule.updateRecords(appID, recordsData);
        return updateRecordByIdResult.then((rsp) => {
          expect(rsp.revision).toEqual('7');
        });
      });
      /**
      * Required data
      * Error will be displayed when there is record without data for required field in the records arrray
      */
      it('[Record module-118] - should return the error in the result: Error will be displayed when there is record without data for required field in the records arrray', () => {
        const appID = 22;
        const recordDataUpdate = {
          'app': appID,
          'records': [
            {
              'id': 1,
              'revision': 4,
              'record': {
                'string_1': {
                  'value': 'Silver plates'
                }
              }
            },
            {
              'id': 2,
              'revision': 1,
              'record': {
                'string_multi': {
                  'value': 'The quick brown fox.'
                }
              }
            }
          ]
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
          .put(`/k/v1/records.json`, (rqBody) => {
            expect(rqBody.records).toMatchObject(recordsData);
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
        const getRecordResult = recordModule.updateRecords(appID, recordsData);
        return getRecordResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });

      /**
      * Invalid field
      * The field will be skipped when there is record with invalid field in the records array
      */
      it('[Record module-119] - should update record and skipped invalid field in the records array', () => {
        const appID = 22;
        const recordDataUpdate = {
          'app': appID,
          'records': [
            {
              'id': 1,
              'revision': 4,
              'record': {
                'string_1': {
                  'value': 'Silver plates'
                }
              }
            },
            {
              'id': 2,
              'revision': 1,
              'record': {
                'string_multi_error_field': {
                  'value': 'The quick brown fox.'
                }
              }
            }
          ]
        };
        const recordsData = [recordDataUpdate];
        nock('https://' + common.DOMAIN)
          .put('/k/v1/records.json', (rqBody) => {
            expect(rqBody.records).toMatchObject(recordsData);
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
          .reply(200, {'revision': '9'});
        const recordModule = new Record(conn);
        const updateRecordByIdResult = recordModule.updateRecords(appID, recordsData);
        return updateRecordByIdResult.then((rsp) => {
          expect(rsp.revision).toEqual('9');
        });
      });
      /**
      * Invalid data
      * The error will be displayed when there is one record has invalid data (text for number field)
      */
      it('[Record module-120] - should return the error in the result: The error will be displayed when there is one record has invalid data (text for number field)', () => {
        const appID = 22;
        const recordDataUpdate = {
          'app': appID,
          'records': [
            {
              'id': 1,
              'revision': 4,
              'record': {
                'string_1': {
                  'value': 'Silver plates'
                }
              }
            },
            {
              'id': 2,
              'revision': 1,
              'record': {
                'Number': {
                  'value': 'The quick brown fox.'
                }
              }
            }
          ]
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
          .put(`/k/v1/records.json`, (rqBody) => {
            expect(rqBody.records).toMatchObject(recordsData);
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
        const getRecordResult = recordModule.updateRecords(appID, recordsData);
        return getRecordResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
      /**
      * Invalid data
      * The error will be displayed when there is one record has invalid data (duplicate data for "prohibit duplicate value" field)
      */
      it('[Record module-121] - should return the error in the result: The error will be displayed when there is one record has invalid data (duplicate data for "prohibit duplicate value" field)', () => {
        const appID = 22;
        const recordDataUpdate = {
          'app': appID,
          'records': [
            {
              'id': 1,
              'revision': 4,
              'record': {
                'title_event': {
                  'value': 'Silver plates'
                }
              }
            },
            {
              'id': 2,
              'revision': 1,
              'record': {
                'Number': {
                  'value': '5'
                }
              }
            }
          ]
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
          .put(`/k/v1/records.json`, (rqBody) => {
            expect(rqBody.records).toMatchObject(recordsData);
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
        const getRecordResult = recordModule.updateRecords(appID, recordsData);
        return getRecordResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });

      /**
      * Invalid data
      * The error will be displayed when there is one record has invalid data (exceed maximum for number field)
      */
      it('[Record module-122] - should return the error in the result: The error will be displayed when there is one record has invalid data (exceed maximum for number field)', () => {
        const appID = 22;
        const recordDataUpdate = {
          'app': appID,
          'records': [
            {
              'id': 1,
              'revision': 4,
              'record': {
                'string_1': {
                  'value': 'Silver plates'
                }
              }
            },
            {
              'id': 2,
              'revision': 1,
              'record': {
                'Number': {
                  'value': '59'
                }
              }
            }
          ]
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
          .put(`/k/v1/records.json`, (rqBody) => {
            expect(rqBody.records).toMatchObject(recordsData);
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
        const getRecordResult = recordModule.updateRecords(appID, recordsData);
        return getRecordResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
  });
});