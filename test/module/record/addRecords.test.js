
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
if (config.hasOwnProperty('proxy') && config.proxy) {
  conn.addRequestOption('proxy', config.proxy);
}

const recordModule = new KintoneRecord(conn);

describe('addRecords function', () => {
  describe('common case', () => {

    it('should return a promise', () => {
      nock('https://' + config.domain)
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
      it('should add successfully the record', () => {
        const data = {
          appID: 1,
          recordsData: [{Text_0: {value: 1}}, {Text_0: {value: 2}}]
        };

        nock('https://' + config.domain)
          .post('/k/v1/records.json', (rqBody) => {
            expect(rqBody.records).toEqual(expect.arrayContaining(data.recordsData));
            return rqBody.app === data.appID;
          })
          .matchHeader('X-Cybozu-Authorization', (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(config.username, config.password));
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

        const addRecordsResult = recordModule.addRecords(data.appID, data.recordsData);
        return addRecordsResult.then((rsp) => {
          expect(rsp).toHaveProperty('ids');
          expect(rsp.revisions).toEqual(expect.arrayContaining(['1', '1']));
        });
      });
    // todo
    });
  // todo
  });

  describe('error', () => {
    describe('invalid app ID', () => {
      it('should return error when using unexisted appID', () => {
        const data = {
          unexistedAppID: 999,
          recordsData: [{Text_0: {value: 1}}, {Text_0: {value: 2}}]
        };
        const expectResult = common.getUnexistedAppResp(data.unexistedAppID);
        nock('https://' + config.domain)
          .post('/k/v1/records.json', (rqBody) => {
            expect(rqBody.app).toEqual(data.unexistedAppID);
            return true;
          })
          .reply(404, expectResult);

        const addRecordsResult = recordModule.addRecords(data.unexistedAppID, data.recordsData);
        return addRecordsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneExeption);
          expect(err.get()).toHaveProperty('id');
          expect(err.get().code).toEqual(expectResult.code);
          expect(err.get().message).toEqual(expectResult.message);
        });
      });

      it('should return error when using negative appID', () => {
        const data = {
          negativeAppID: 999,
          recordsData: [{Text_0: {value: 1}}, {Text_0: {value: 2}}]
        };
        const expectResult = common.getMissingOrInvalidInputResp();
        nock('https://' + config.domain)
          .post('/k/v1/records.json', (rqBody) => {
            expect(rqBody.app).toEqual(data.negativeAppID);
            return true;
          })
          .reply(400, expectResult);

        const addRecordsResult = recordModule.addRecords(data.negativeAppID, data.recordsData);
        return addRecordsResult.catch((err) => {
          expect(err.get()).toHaveProperty('id');
          expect(err.get().code).toEqual(expectResult.code);
          expect(err.get().message).toEqual(expectResult.message);
          expect(err.get()).toHaveProperty('errors');
        });
      });

      it('should return error when appID is 0', () => {
        const data = {
          appID: 0,
          recordsData: [{Text_0: {value: 1}}, {Text_0: {value: 2}}]
        };
        const expectResult = common.getMissingOrInvalidInputResp();
        nock('https://' + config.domain)
          .post('/k/v1/records.json', (rqBody) => {
            expect(rqBody.app).toEqual(0);
            return true;
          })
          .reply(400, expectResult);

        const addRecordsResult = recordModule.addRecords(data.appID, data.recordsData);
        return addRecordsResult.catch((err) => {
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
