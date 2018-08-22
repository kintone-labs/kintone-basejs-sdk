
/**
 * kintone api - nodejs client
 * test record module
 */

const KintoneExeption = require('../../../src/exception/KintoneAPIException');
const KintoneConnection = require('../../../src/connection/Connection');
const KintoneAuth = require('../../../src/authentication/Auth');
const KintoneRecord = require('../../../src/module/record/Record');
const nock = require('nock');
const config = require('../../config');
const Common = require('../../Common');

const auth = new KintoneAuth();
auth.setPasswordAuth(config.username, config.password);

const conn = new KintoneConnection(config.domain, auth);
if (config.hasOwnProperty('proxyPost') && config.proxyHost) {
  conn.setProxy(config.proxyHost, config.proxyPost);
}

const common = new Common();

describe('addRecord function', () => {
  describe('common case', () => {
    it('should return a promise', () => {
      nock('https://' + config.domain)
        .post('/k/v1/record.json')
        .reply(200, {'id': '100', 'revision': '1'});
      const recordModule = new KintoneRecord(conn);
      const addRecordResult = recordModule.addRecord();
      expect(addRecordResult).toHaveProperty('then');
      expect(addRecordResult).toHaveProperty('catch');
    });
  // todo
  });

  describe('success case', () => {
    describe('valid Data', () => {
      const body = {
        appID: 1,
        recordData: {
          Dropdown: {value: 1},
          Text: {value: 'test'},
          Number: {value: 1}
        }
      };

      it('should add successfully with full data', () => {
        nock('https://' + config.domain)
          .post('/k/v1/record.json', (rqBody) => {
            expect(rqBody.record).toMatchObject(body.recordData);
            return rqBody.app === body.appID;
          })
          .matchHeader('X-Cybozu-Authorization', (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(config.username, config.password));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, {'id': '100', 'revision': '1'});
        const recordModule = new KintoneRecord(conn);
        return recordModule.addRecord(body.appID, body.recordData)
          .then(rsp => {
            expect(rsp).toHaveProperty('id');
            expect(rsp).toHaveProperty('revision');
          });
      });
      // todo
    });
  // todo
  });

  describe('error case', () => {
    describe('invalid appID', () => {
      it('should return error when using unexisted appID', () => {
        const unexistedAppID = 999;
        const expectResult = common.getUnexistedAppResp(unexistedAppID);
        nock('https://' + config.domain, (rqBody) => {
          expect(rqBody.app).toEqual(unexistedAppID);
          return true;
        })
          .post('/k/v1/record.json')
          .reply(404, expectResult);

        const recordModule = new KintoneRecord(conn);
        return recordModule.addRecord(unexistedAppID)
          .catch(err => {
            expect(err.get()).toHaveProperty('id');
            expect(err.get().code).toEqual(expectResult.code);
            expect(err.get().message).toEqual(expectResult.message);
          });
      });
      it('should return error when using negative appID', () => {
        const negativeAppID = -1;
        const expectResult = common.getMissingOrInvalidInputResp();
        nock('https://' + config.domain)
          .post('/k/v1/record.json')
          .reply(400, expectResult);

        const recordModule = new KintoneRecord(conn);
        return recordModule.addRecord(negativeAppID)
          .catch(err => {
            expect(err.get()).toHaveProperty('id');
            expect(err.get().code).toEqual(expectResult.code);
            expect(err.get().message).toEqual(expectResult.message);
            expect(err.get()).toHaveProperty('errors');
          });
      });
      it('should return error when appID is 0', () => {
        const appID = 0;
        const expectResult = common.getMissingOrInvalidInputResp();
        nock('https://' + config.domain)
          .post('/k/v1/record.json')
          .reply(400, expectResult);

        const recordModule = new KintoneRecord(conn);
        return recordModule.addRecord(appID)
          .catch(err => {
            expect(err.get()).toHaveProperty('id');
            expect(err.get().code).toEqual(expectResult.code);
            expect(err.get().message).toEqual(expectResult.message);
            expect(err.get()).toHaveProperty('errors');
          });
      });
    });
  // todo
  });
});
