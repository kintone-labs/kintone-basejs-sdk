
/**
 *  kintone api - nodejs client
 * test record module
 */
const nock = require('nock');

const config = require('../../config');
const common = require('../../common');

const KintoneAPIException = require('../../../src/exception/KintoneAPIException');
const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const Record = require('../../../src/module/record/Record');

const auth = new Auth();
auth.setPasswordAuth(config.username, config.password);

const conn = new Connection(config.domain, auth);

const recordModule = new Record(conn);

describe('deleteRecords function', () => {
  describe('common case', () => {
    it('should return a promise', () => {
      const data = {
        app: 2,
        ids: [1]
      };
      nock('https://' + config.domain)
        .intercept('/k/v1/records.json', 'DELETE')
        .reply(200, {});
      const deleteRecordsResult = recordModule.deleteRecords(data.app, data.ids);
      expect(deleteRecordsResult).toHaveProperty('then');
      expect(deleteRecordsResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Single delete', () => {
      it('should delete successfully the record when specifying only 1 id', () => {
        const data = {
          app: 2,
          ids: [1]
        };
        nock('https://' + config.domain)
          .intercept('/k/v1/records.json', 'DELETE', (rqBody) => {
            expect(rqBody.app).toEqual(data.app);
            expect(rqBody.ids).toEqual(data.ids);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(config.username, config.password));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, {});

        const deleteRecordsResult = recordModule.deleteRecords(data.app, data.ids);
        return deleteRecordsResult.then((rsp) => {
          expect(rsp).toEqual({});
        });
      });
    });
    /**
    * Todo: implement more case
    */
  });

  describe('error case', () => {
    describe('Invalid record id', () => {
      it('should return error when the record id is not exsist', () => {
        const data = {
          app: 2,
          ids: [1000]
        };
        nock('https://' + config.domain)
          .intercept('/k/v1/records.json', 'DELETE', (rqBody) => {
            expect(rqBody.app).toEqual(data.app);
            expect(rqBody.ids).toEqual(data.ids);
            return true;
          })
          .reply(404, {'code': 'GAIA_RE01', 'id': 'oXd3Yf2UTlJO7aoDATQT', 'message': '指定したレコード（id: 100000）が見つかりません。'});

        const deleteRecordsResult = recordModule.deleteRecords(data.app, data.ids);
        return deleteRecordsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
        });
      });
    });
    /**
    * Todo: implement another error case
    */
  });
});
