
/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require('nock');

const common = require('../../common');

const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const Record = require('../../../src/module/record/Record');

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

const recordModule = new Record(conn);

describe('updateRecordByUpdateKey function', () => {
  describe('common case', () => {
    const appID = 1;
    const updateKey = {
      field: 'Text_0',
      value: '1234'
    };
    const recordData = {
      Number: {
        value: 1
      }
    };

    it('[Record module-0-common] - should return a promise', () => {
      nock('https://' + common.DOMAIN)
        .put('/k/v1/record.json')
        .reply(200, {'revisions': '2'});

      const updateRecordByUpdateKeyResult = recordModule.updateRecordByUpdateKey(appID, updateKey, recordData);
      expect(updateRecordByUpdateKeyResult).toHaveProperty('then');
      expect(updateRecordByUpdateKeyResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('valid data', () => {
      it('[Record module-85] - should update successfully the record', () => {
        const data = {
          'app': 777,
          'updateKey': {
            'field': 'unique_key',
            'value': 'CODE123'
          },
          'revision': 2,
          'record': {
            'string_multi': {
              'value': 'this value has been updated'
            }
          }
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
          .reply(200, {'revision': '3'});

        const updateRecordByUpdateKeyResult = recordModule.updateRecordByUpdateKey(data.app, data.updateKey, data.record, data.revision);
        return updateRecordByUpdateKeyResult.then((rsp) => {
          expect(rsp.revision).toEqual('3');
        });
      });
      /**
      * Todo: implement another success case
      */

      /**
       * Revision -1 
       * The record is still updated successfully, the revision is increased by 1 after update
       */
      it('[Record module-86] - should update successfully when the revision is -1', () => {
        const data = {
          'app': '22',
          'updateKey': {
            'field': 'Number',
            'value': '5'
          },
          'revision': -1,
          'record': {
            'title_event': {
              'value': 'Updated'
            }
          }
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
          .reply(200, {'revision': '3'});

        const updateRecordByUpdateKeyResult = recordModule.updateRecordByUpdateKey(data.app, data.updateKey, data.record, data.revision);
        return updateRecordByUpdateKeyResult.then((rsp) => {
          expect(rsp.revision).toEqual('3');
        });
      });

      /**
       * Data table
       * Verify the data for record with table is added successfully
       */
      it('[Record module-104] - Verify the data for record with table is added successfully', () => {
        const recordDataUpdate = {
          'app': '22',
          'updateKey': {
            'field': 'Number',
            'value': '5'
          },
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
        nock('https://' + common.DOMAIN)
          .put('/k/v1/record.json', (rqBody) => {
            expect(rqBody).toMatchObject(recordDataUpdate);
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
        const updateRecordByIdResult = recordModule.updateRecordByUpdateKey(recordDataUpdate.app, recordDataUpdate.updateKey, recordDataUpdate.record);
        return updateRecordByIdResult.then((rsp) => {
          expect(rsp.revision).toEqual('2');
        });
      });

      /**
       * Guest space
       * The record is updated successfully for app in guest space
       */
      it('[Record module-105] - The record is updated successfully for app in guest space', () => {
        const connGuestSpace = new Connection(common.DOMAIN, auth, common.GUEST_SPACEID);
        const recordDataUpdate = {
          'app': '777',
          'updateKey': {
            'field': 'Number',
            'value': '5'
          },
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
        nock('https://' + common.DOMAIN)
          .put('/k/v1/record.json', (rqBody) => {
            expect(rqBody).toMatchObject(recordDataUpdate);
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
        const recordModule_Guest = new Record(connGuestSpace);
        const updateRecordByIdResult = recordModule_Guest.updateRecordByUpdateKey(recordDataUpdate.app, recordDataUpdate.updateKey, recordDataUpdate.record);
        return updateRecordByIdResult.then((rsp) => {
          expect(rsp.revision).toEqual('3');
        });
      });

      /**
       * Invalid input type
       * The function still work correctly when executing with interger as string type (input string for interger and vice versa) 
       */
      it('[Record module-106] - The function still work correctly when executing with interger as string type (input string for interger and vice versa) ', () => {
        const recordDataUpdate = {
          'app': 777,
          'updateKey': {
            'field': 'Number',
            'value': '5'
          },
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
        nock('https://' + common.DOMAIN)
          .put('/k/v1/record.json', (rqBody) => {
            expect(rqBody).toMatchObject(recordDataUpdate);
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
        const updateRecordByIdResult = recordModule.updateRecordByUpdateKey(recordDataUpdate.app, recordDataUpdate.updateKey, recordDataUpdate.record);
        return updateRecordByIdResult.then((rsp) => {
          expect(rsp.revision).toEqual('4');
        });
      });
    });

    describe('error case', () => {
      describe('wrong revision', () => {
        it('[Record module-87] - should return error when using wrong revison', () => {
          const data = {
            'app': 777,
            'updateKey': {
              'field': 'unique_key',
              'value': 'CODE123'
            },
            'revision': 655,
            'record': {
              'string_multi': {
                'value': 'this value has been updated'
              }
            }
          };
          const expectResult = {'code': 'GAIA_CO02',
            'id': 'MJkW0PkiEJ3HhuPRkl3H',
            'message': '指定したrevisionは最新ではありません。ほかのユーザーがレコードを更新した可能性があります。'};
          nock('https://' + common.DOMAIN)
            .put('/k/v1/record.json', (rqBody) => {
              expect(rqBody).toMatchObject(data);
              return true;
            })
            .reply(409, expectResult);

          return recordModule.updateRecordByUpdateKey(data.app, data.updateKey, data.record, data.revision).catch((err) => {
            expect(err.get()).toMatchObject(expectResult);
          });
        });
      });
      /**
      * Todo: implement another error case
      */

      /**
       * wrong updatekey - The error will occur and record is not updated
       */
      describe('wrong update key', () => {
        it('[Record module-88] - should return error when using wrong updatekey', () => {
          const data = {
            'app': 777,
            'updateKey': {
              'field': 'unique_key_error',
              'value': 'CODE123'
            },
            'revision': 655,
            'record': {
              'string_multi': {
                'value': 'this value has been updated'
              }
            }
          };
          const expectResult = {
            'code': 'CB_VA01',
            'id': 'z8L3jd329RCNjR5ZatyK',
            'message': 'Missing or invalid input.',
            'errors': {
              'updateKey': {
                'messages': [
                  'The record to be updated must be specified by one of the parameters "id" and "updateKey".'
                ]
              },
              'id': {
                'messages': [
                  'The record to be updated must be specified by one of the parameters "id" and "updateKey".'
                ]
              }
            }
          };
          nock('https://' + common.DOMAIN)
            .put('/k/v1/record.json', (rqBody) => {
              expect(rqBody).toMatchObject(data);
              return true;
            })
            .reply(400, expectResult);

          return recordModule.updateRecordByUpdateKey(data.app, data.updateKey, data.record, data.revision).catch((err) => {
            expect(err.get()).toMatchObject(expectResult);
          });
        });
      });

      /**
       * updatekey is not unique - Setting the updatekey field with "prohibit duplicate value" is turned off, the error will occur and record is not updated
       */
      describe('updatekey is not unique', () => {
        it('[Record module-89] - should return error when updatekey is not unique', () => {
          const data = {
            'app': 777,
            'updateKey': {
              'field': 'unique_key',
              'value': 'CODE123'
            },
            'revision': 655,
            'record': {
              'string_multi': {
                'value': 'this value has been updated'
              }
            }
          };
          const expectResult = {
            'code': 'GAIA_IQ27',
            'id': 'Yux7BxLRhcxIrcDLkCB5',
            'message': 'Failed to update record. The field (code: Number) set as "updateKey" must be set to "Prohibit duplicate values".'
          };
          nock('https://' + common.DOMAIN)
            .put('/k/v1/record.json', (rqBody) => {
              expect(rqBody).toMatchObject(data);
              return true;
            })
            .reply(400, expectResult);

          return recordModule.updateRecordByUpdateKey(data.app, data.updateKey, data.record, data.revision).catch((err) => {
            expect(err.get()).toMatchObject(expectResult);
          });
        });
      });
      /**
       * multiple update keys - Setting 2 updatekey fields, verify the data is updated successfully
       */
      describe('multiple update keys', () => {
        it('[Record module-90] - should return error when multiple update keys', () => {
          const data = {
            'app': 777,
            'updateKey': {
              'field': 'unique_key',
              'value': 'CODE123'
            },
            'updateKey': {
              'field': 'unique_key',
              'value': 'CODE123'
            },
            'revision': 655,
            'record': {
              'string_multi': {
                'value': 'this value has been updated'
              }
            }
          };
          const expectResult = {
            'code': 'GAIA_IQ27',
            'id': 'Yux7BxLRhcxIrcDLkCB5',
            'message': 'Failed to update record. The field (code: Number) set as "updateKey" must be set to "Prohibit duplicate values".'
          };
          nock('https://' + common.DOMAIN)
            .put('/k/v1/record.json', (rqBody) => {
              expect(rqBody).toMatchObject(data);
              return true;
            })
            .reply(400, expectResult);

          return recordModule.updateRecordByUpdateKey(data.app, data.updateKey, data.record, data.revision).catch((err) => {
            expect(err.get()).toMatchObject(expectResult);
          });
        });
      });
      /**
       * Update data system field
       * Error is displayed when updating these fields:
       *  Created by
       *  Updated by
       *  Created datetime
       *  Updated datetime
       */
      it('[Record module-91] - should return the error in the result: Error is displayed when updating these fields:' +
        'Created by' +
        'Updated by' +
        'Created datetime' +
        'Updated datetime', () => {
        const recordDataUpdate = {
          'app': 777,
          'updateKey': {
            'field': 'unique_key',
            'value': 'CODE123'
          },
          'revision': 655,
          'record': {
            'string_multi': {
              'value': 'this value has been updated'
            }
          }
        };

        const expectResult = {
          'code': 'CB_IJ01',
          'id': 'wcRfYn4IOTtdsHuExF5a',
          'message': 'Invalid JSON string.'
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/record.json`, (rqBody) => {
            expect(rqBody).toMatchObject(recordDataUpdate);
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
        return recordModule.updateRecordByUpdateKey(recordDataUpdate.app, recordDataUpdate.updateKey, recordDataUpdate.record, recordDataUpdate.revision).catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
      /**
       * Permission
       * Error happens when user does not have Edit permission for app
       */
      it('[Record module-92] - should return the error in the result: Error happens when user does not have Edit permission for app', () => {
        const recordDataUpdate = {
          'app': 777,
          'updateKey': {
            'field': 'unique_key',
            'value': 'CODE123'
          },
          'revision': 655,
          'record': {
            'string_multi': {
              'value': 'this value has been updated'
            }
          }
        };

        const expectResult = {
          'code': 'CB_NO02',
          'id': 'M00VPaOdPEmu4kNlBawh',
          'message': 'No privilege to proceed.'
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/record.json`, (rqBody) => {
            expect(rqBody).toMatchObject(recordDataUpdate);
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
        
        return recordModule.updateRecordByUpdateKey(recordDataUpdate.app, recordDataUpdate.updateKey, recordDataUpdate.record, recordDataUpdate.revision).catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
      /**
       * Permission
       * Error happens when user does not have Edit permission for record
       */
      it('[Record module-93] - should return the error in the result: Error happens when user does not have Edit permission for record', () => {
        const recordDataUpdate = {
          'app': 777,
          'updateKey': {
            'field': 'unique_key',
            'value': 'CODE123'
          },
          'revision': 655,
          'record': {
            'string_multi': {
              'value': 'this value has been updated'
            }
          }
        };

        const expectResult = {
          'code': 'CB_NO02',
          'id': 'M00VPaOdPEmu4kNlBawh',
          'message': 'No privilege to proceed.'
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/record.json`, (rqBody) => {
            expect(rqBody).toMatchObject(recordDataUpdate);
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
        return recordModule.updateRecordByUpdateKey(recordDataUpdate.app, recordDataUpdate.updateKey, recordDataUpdate.record, recordDataUpdate.revision).catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
      /**
       * Permission
       * Error happens when user does not have Edit permission for field
       */
      it('[Record module-94] - should return the error in the result: Error happens when user does not have Edit permission for field', () => {
        const recordDataUpdate = {
          'app': 777,
          'updateKey': {
            'field': 'unique_key',
            'value': 'CODE123'
          },
          'revision': 655,
          'record': {
            'string_multi': {
              'value': 'this value has been updated'
            }
          }
        };
        const expectResult = {
          'code': 'GAIA_FU01',
          'id': 'xnADSZe3pmfqNwkVtmsg',
          'message': 'Edit permissions are required to edit field "title_event".'
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/record.json`, (rqBody) => {
            expect(rqBody).toMatchObject(recordDataUpdate);
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
        return recordModule.updateRecordByUpdateKey(recordDataUpdate.app, recordDataUpdate.updateKey, recordDataUpdate.record, recordDataUpdate.revision).catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
      /**
       * Invalid app ID
       * The error will be displayed when using invalid app ID (unexisted, negative number, 0)
       */
      it('[Record module-95] - should return the error in the result: The error will be displayed when using invalid app ID (unexisted, negative number, 0)', () => {
        const recordDataUpdate = {
          'app': 777,
          'updateKey': {
            'field': 'unique_key',
            'value': 'CODE123'
          },
          'revision': 655,
          'record': {
            'string_multi': {
              'value': 'this value has been updated'
            }
          }
        };
        const expectResult = {
          'code': 'GAIA_AP01',
          'id': 'F1m5aSXHdHNEWxY9gZdS',
          'message': 'The app (ID: 220) not found. The app may have been deleted.'
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/record.json`, (rqBody) => {
            expect(rqBody).toMatchObject(recordDataUpdate);
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
        return recordModule.updateRecordByUpdateKey(recordDataUpdate.app, recordDataUpdate.updateKey, recordDataUpdate.record, recordDataUpdate.revision).catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
      /**
       * Missing required field
       * The error will be displayed when using method without app ID
       */
      it('[Record module-96] - should return the error in the result: The error will be displayed when using invalid record ID (unexisted, negative number, 0)', () => {
        const recordDataUpdate = {
          'app': null,
          'updateKey': {
            'field': 'unique_key',
            'value': 'CODE123'
          },
          'revision': 655,
          'record': {
            'string_multi': {
              'value': 'this value has been updated'
            }
          }
        };
        const expectResult = {
          'code': 'CB_IJ01',
          'id': '2EvqyBpppiTZP4wQfPtx',
          'message': 'Invalid JSON string.'
        };
        nock('https://' + common.DOMAIN)
          .put(`/k/v1/record.json`, (rqBody) => {
            expect(rqBody).toMatchObject(recordDataUpdate);
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
        return recordModule.updateRecordByUpdateKey(recordDataUpdate.app, recordDataUpdate.updateKey, recordDataUpdate.record, recordDataUpdate.revision).catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
      /**
       * Missing required field
       * Revision is increased by 1, no data is updated when using method without records data
       */
      it('[Record module-97] - should return revision and increased by 1, no data updated', () => {
        const recordDataUpdate = {
          'app': null,
          'updateKey': {
            'field': 'unique_key',
            'value': 'CODE123'
          },
          'revision': 7,
          'record': {
          }
        };
        nock('https://' + common.DOMAIN)
          .put('/k/v1/record.json', (rqBody) => {
            expect(rqBody).toMatchObject(recordDataUpdate);
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
        return recordModule.updateRecordByUpdateKey(recordDataUpdate.app, recordDataUpdate.updateKey, recordDataUpdate.record, recordDataUpdate.revision).then((rsp) => {
          expect(rsp.revision).toEqual('7');
        });
      });
      /**
       * Required data
       * Error will be displayed when there is record without data for required field in the records arrray
       */
      it('[Record module-98] - should return the error in the result: Error will be displayed when there is record without data for required field in the records arrray', () => {
        const recordDataUpdate = {
          'app': null,
          'updateKey': {
            'field': 'unique_key',
            'value': 'CODE123'
          },
          'revision': 7,
          'record': {
          }
        };
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
            expect(rqBody).toMatchObject(recordDataUpdate);
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
        return recordModule.updateRecordByUpdateKey(recordDataUpdate.app, recordDataUpdate.updateKey, recordDataUpdate.record, recordDataUpdate.revision).catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
      /**
       * Invalid field
       * The field will be skipped when there is record with invalid field in the records array
       */
      it('[Record module-99] - should update record and skipped invalid field in the records array', () => {
        const recordDataUpdate = {
          'app': null,
          'updateKey': {
            'field': 'unique_key',
            'value': 'CODE123'
          },
          'revision': 7,
          'record': {
            'title_event': {
              'value': 'Updated'
            },
            'RequiredField22': {
              'value': 'Updated'
            }
          }
        };
        nock('https://' + common.DOMAIN)
          .put('/k/v1/record.json', (rqBody) => {
            expect(rqBody).toMatchObject(recordDataUpdate);
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
        return recordModule.updateRecordByUpdateKey(recordDataUpdate.app, recordDataUpdate.updateKey, recordDataUpdate.record, recordDataUpdate.revision).then((rsp) => {
          expect(rsp.revision).toEqual('9');
        });
      });
      /**
       * Invalid data
       * The error will be displayed when there is one record has invalid data (text for number field)
       */
      it('[Record module-100] - should return the error in the result: The error will be displayed when there is one record has invalid data (text for number field)', () => {
        const recordDataUpdate = {
          'app': 22,
          'updateKey': {
            'field': 'unique_key',
            'value': 'CODE123'
          },
          'revision': null,
          'record': {
            'title_event': {
              'value': 'Updated'
            },
            'Number': {
              'value': 'Dan kha'
            }
          }
        };
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
            expect(rqBody).toMatchObject(recordDataUpdate);
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
        return recordModule.updateRecordByUpdateKey(recordDataUpdate.app, recordDataUpdate.updateKey, recordDataUpdate.record, recordDataUpdate.revision).catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
      /**
       * Invalid data
       * The error will be displayed when there is one record has invalid data (duplicate data for "prohibit duplicate value" field)
       */
      it('[Record module-101] - should return the error in the result: The error will be displayed when there is one record has invalid data (duplicate data for "prohibit duplicate value" field)', () => {
        const recordDataUpdate = {
          'app': 22,
          'updateKey': {
            'field': 'unique_key',
            'value': 'CODE123'
          },
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
            expect(rqBody).toMatchObject(recordDataUpdate);
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
        return recordModule.updateRecordByUpdateKey(recordDataUpdate.app, recordDataUpdate.updateKey, recordDataUpdate.record, recordDataUpdate.revision).catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
      
      /**
       * Invalid data
       * The error will be displayed when there is one record has invalid data (exceed maximum for number field)
       */
      it('[Record module-102] - should return the error in the result: The error will be displayed when there is one record has invalid data (exceed maximum for number field)', () => {
        const recordDataUpdate = {
          'app': 22,
          'updateKey': {
            'field': 'unique_key',
            'value': 'CODE123'
          },
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
            expect(rqBody).toMatchObject(recordDataUpdate);
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
        return recordModule.updateRecordByUpdateKey(recordDataUpdate.app, recordDataUpdate.updateKey, recordDataUpdate.record, recordDataUpdate.revision).catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
  });
});