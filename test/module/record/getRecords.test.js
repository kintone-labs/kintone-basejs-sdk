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
  query: '',
  fields: [],
  isShowTotalCount: false
};

const recordModule = new KintoneRecord(conn);

describe('getRecords should have enough property', () => {
  const getRecordsResult = recordModule.getRecords();
  it('getRecords should have a "then" property', () => {
    return expect(getRecordsResult).toHaveProperty('then');
  });

  it('getRecords should have a "catch" property', () => {
    return expect(getRecordsResult).toHaveProperty('catch');
  });
});

describe('getRecords success', () => {
  const getRecordsResult = recordModule.getRecords(data.appID);
  it('getRecords success should have a "records" property', () => {
    return getRecordsResult.then((rsp) => {
      expect(rsp).toHaveProperty('records');
    });
  });
});

describe('No param is specified, Get records error', () => {
  const getRecordsResult = recordModule.getRecords();
  it('"getRecords" error should have a "id" property', () => {
    return getRecordsResult.catch((err) => {
      expect(err).toBeInstanceOf(KintoneExeption);
      expect(err.get()).toHaveProperty('id');
    });
  });
});

