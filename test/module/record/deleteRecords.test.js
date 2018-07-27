
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
if (env.hasOwnProperty('proxy') && env.proxy) {
  conn.addRequestOption('proxy', env.proxy);
}

const data = {
  appID: env.app,
  recordIDs: [5, 6]
};

const recordModule = new KintoneRecord(conn);

describe('deleteRecords should have enough property', () => {
  const deleteRecordsResult = recordModule.deleteRecords();
  it('deleteRecords should have a "then" property', () => {
    return expect(deleteRecordsResult).toHaveProperty('then');
  });

  it('deleteRecords should have a "catch" property', () => {
    return expect(deleteRecordsResult).toHaveProperty('catch');
  });
});

describe('deleteRecords success', () => {
  const deleteRecordsResult = recordModule.deleteRecords(data.appID, data.recordIDs);
  it('deleteRecords success should return an empty JSON', () => {
    return deleteRecordsResult.then((rsp) => {
      expect(rsp).toEqual({});
    });
  });
});

describe('No param is specified, deleteRecords error', () => {
  const deleteRecordsResult = recordModule.deleteRecords();
  it('"deleteRecords" error should have a "id" property', () => {
    return deleteRecordsResult.catch((err) => {
      expect(err).toBeInstanceOf(KintoneExeption);
      expect(err.get()).toHaveProperty('id');
    });
  });
});
