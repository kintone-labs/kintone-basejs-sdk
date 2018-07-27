
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
  recordID: 2
};

const recordModule = new KintoneRecord(conn);

describe('getRecord should have enough property', () => {
  const getRecordResult = recordModule.getRecord();
  it('getRecord should have a "then" property', () => {
    return expect(getRecordResult).toHaveProperty('then');
  });

  it('getRecord should have a "catch" property', () => {
    return expect(getRecordResult).toHaveProperty('catch');
  });
});

describe('getRecord success', () => {
  const getRecordResult = recordModule.getRecord(data.appID, data.recordID);
  it('getRecord success should have a "record" property', () => {
    return getRecordResult.then((rsp) => {
      expect(rsp).toHaveProperty('record');
    });
  });
});

describe('No param is specified, getRecord error', () => {
  const getRecordResult = recordModule.getRecord('');
  it('"getRecord" error should have a "id" property', () => {
    return getRecordResult.catch((err) => {
      expect(err).toBeInstanceOf(KintoneExeption);
      expect(err.get()).toHaveProperty('id');
    });
  });
});
