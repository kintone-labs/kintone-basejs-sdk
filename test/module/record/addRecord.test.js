
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
  recordData: {}
};

const recordModule = new KintoneRecord(conn);

describe('addRecord should have enough property', () => {
  const addRecordResult = recordModule.addRecord();
  it('addRecord should have a "then" property', () => {
    return expect(addRecordResult).toHaveProperty('then');
  });

  it('addRecord should have a "catch" property', () => {
    return expect(addRecordResult).toHaveProperty('catch');
  });
});

describe('addRecord success', () => {
  const addRecordResult = recordModule.addRecord(data.appID, data.recordData);
  it('addRecord success should have a "id" property', () => {
    return addRecordResult.then((rsp) => {
      expect(rsp).toHaveProperty('id');
    });
  });
});

describe('No param is specified, addRecord error', () => {
  const addRecordResult = recordModule.addRecord('');
  it('"addRecord" error should have a "id" property', () => {
    return addRecordResult.catch((err) => {
      expect(err).toBeInstanceOf(KintoneExeption);
      expect(err.get()).toHaveProperty('id');
    });
  });
});
