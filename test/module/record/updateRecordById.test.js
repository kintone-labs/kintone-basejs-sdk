
/**
 * kintone api - nodejs client
 * test record module
 */

const KintoneExeption = require('../../../src/exception/KintoneAPIException');
const KintoneConnection = require('../../../src/connection/Connection');
const KintoneAuth = require('../../../src/authentication/Auth');
const KintoneRecord = require('../../../src/module/record/Record');
const config = require('../../config');
const nock = require('nock');
const Common = require('../../Common');

const common = new Common();

const auth = new KintoneAuth();
auth.setPasswordAuth(config.username, config.password);

const conn = new KintoneConnection(config.domain, auth);
if (config.hasOwnProperty('proxyPost') && config.proxyHost) {
  conn.setProxy(config.proxyHost, config.proxyPost);
}

describe('updateRecordById function', () => {
  describe('common case', () => {

    it('should return a promise', () => {
      nock('https://' + config.domain)
        .put('/k/v1/record.json')
        .reply(200, {
          'ids': ['1'],
          'revisions': ['1']
        });

      const recordModule = new KintoneRecord(conn);
      const updateRecordByIdResult = recordModule.updateRecordById();
      expect(updateRecordByIdResult).toHaveProperty('then');
      expect(updateRecordByIdResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('valid data', () => {
      it('should update successfully the record', () => {
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
        nock('https://' + config.domain)
          .put('/k/v1/record.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader('X-Cybozu-Authorization', (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(config.username, config.password));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, {'revision': '3'});

        const recordModule = new KintoneRecord(conn);
        const updateRecordByIdResult = recordModule.updateRecordById(data.app, data.id, data.record, data.revision);
        return updateRecordByIdResult.then((rsp) => {
          expect(rsp.revision).toEqual('3');
        });
      });
      it('should update successfully when the revision is -1', () => {
        const data = {
          app: 1,
          id: 2,
          record: {
            Text_0: {
              value: 123
            }
          },
          revision: -1
        };
        nock('https://' + config.domain)
          .put('/k/v1/record.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .reply(200, {'revision': '3'});

        const recordModule = new KintoneRecord(conn);
        const updateRecordByIdResult = recordModule.updateRecordById(data.app, data.id, data.record, data.revision);
        return updateRecordByIdResult.then((rsp) => {
          expect(rsp).toHaveProperty('revision');
        });
      });
      // todo
    });

    describe('error case', () => {
      describe('wrong revision', () => {
        it('should return error when using wrong revison', () => {
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
          const expectResult = common.getWrongRevisonResp();
          nock('https://' + config.domain)
            .put('/k/v1/record.json', (rqBody) => {
              expect(rqBody.revision).toEqual(wrongRevison);
              return true;
            })
            .reply(409, expectResult);
          const recordModule = new KintoneRecord(conn);
          return recordModule.updateRecordById(data.app, data.id, data.record, wrongRevison).catch((err) => {
            expect(err.get()).toHaveProperty('id');
            expect(err.get().code).toEqual(expectResult.code);
            expect(err.get().message).toEqual(expectResult.message);
          });
        });
        // todo
      });
      // todo
    });
  });
});