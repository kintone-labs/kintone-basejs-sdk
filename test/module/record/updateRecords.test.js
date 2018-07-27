
/**
 * kintone api - nodejs client
 * test record module
 */

const KintoneExeption = require('../../../src/exception/KintoneAPIException');
const KintoneConnection = require('../../../src/connection/Connection');
const KintoneAuth = require('../../../src/authentication/Auth');
const KintoneRecord = require('../../../src/module/record/Record');
const env = require('../env');

const auth = new KintoneAuth();
auth.setPasswordAuth(env.username, env.password);

const conn = new KintoneConnection(env.domain, auth);
if (env.hasOwnProperty('proxy') && env.proxyHost) {
  conn.setProxy(env.proxyHost, env.proxyPost);
}

const data = {
  appID: env.app,
  recordsData: [{
    id: 2,
    record: {
      Text_0: {
        value: 123
      }
    }
  }]
};

const recordModule = new KintoneRecord(conn);

describe('updateRecords should have enough property', () => {
  const updateRecordsResult = recordModule.updateRecords();
  it('updateRecords should have a "then" property', () => {
    return expect(updateRecordsResult).toHaveProperty('then');
  });

  it('updateRecords should have a "catch" property', () => {
    return expect(updateRecordsResult).toHaveProperty('catch');
  });
});

describe('updateRecords success', () => {
  const updateRecordsResult = recordModule.updateRecords(data.appID, data.recordsData);
  it('updateRecords success should have a "records" property ', () => {
    return updateRecordsResult.then((rsp) => {
      expect(rsp).toHaveProperty('records');
    });
  });

  it('the length of"records" should be 1 ', () => {
    return updateRecordsResult.then((rsp) => {
      expect(rsp.records.length).toEqual(1);
    });
  });
});

describe('No param is specified, updateRecords error', () => {
  const updateRecordsResult = recordModule.updateRecords();
  it('"updateRecords" error should have a "id" property', () => {
    return updateRecordsResult.catch((err) => {
      expect(err).toBeInstanceOf(KintoneExeption);
      expect(err.get()).toHaveProperty('id');
    });
  });
});
