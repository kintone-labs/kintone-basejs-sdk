
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

describe('updateRecordById function', () => {
  describe('common case', () => {

    it('should return a promise', () => {
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
        .reply(200, {'revisions': '1'});

      const recordModule = new Record(conn);
      const updateRecordByIdResult = recordModule.updateRecordByID(data.app, data.id, data.record, data.revision);
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

        const recordModule = new Record(conn);
        const updateRecordByIdResult = recordModule.updateRecordByID(data.app, data.id, data.record, data.revision);
        return updateRecordByIdResult.then((rsp) => {
          expect(rsp.revision).toEqual('3');
        });
      });
      it('should update successfully when the revision is -1', () => {
        const data = {
          app: 1,
          id: 2,
          record: {
            Text_0: {value: 123}
          },
          revision: -1
        };
        nock('https://' + common.DOMAIN)
          .put('/k/v1/record.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .reply(200, {'revision': '3'});

        const recordModule = new Record(conn);
        const updateRecordByIdResult = recordModule.updateRecordByID(data.app, data.id, data.record, data.revision);
        return updateRecordByIdResult.then((rsp) => {
          expect(rsp).toHaveProperty('revision');
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
            app: 1,
            id: 2,
            record: {
              Text_0: {
                value: 123
              }
            }
          };
          const wrongRevison = 3;
          const expectResult = {'code': 'GAIA_CO02',
            'id': 'MJkW0PkiEJ3HhuPRkl3H',
            'message': '指定したrevisionは最新ではありません。ほかのユーザーがレコードを更新した可能性があります。'};
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
    });
  });
});