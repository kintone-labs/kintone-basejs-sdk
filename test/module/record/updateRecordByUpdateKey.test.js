
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

    it('should return a promise', () => {
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
      it('should update successfully the record', () => {
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
    });

    describe('error case', () => {
      describe('wrong revision', () => {
        it('should return error when using wrong revison', () => {
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
    });
  });
});