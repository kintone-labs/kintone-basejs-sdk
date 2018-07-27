
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
  recordsData: [{
    Text_0: {
      value: 1
    }
  }]
};

const recordModule = new KintoneRecord(conn);

describe('addRecords should have enough property', () => {
  const addRecordsResult = recordModule.addRecords();
  it('addRecords should have a "then" property', () => {
    return expect(addRecordsResult).toHaveProperty('then');
  });

  it('addRecords should have a "catch" property', () => {
    return expect(addRecordsResult).toHaveProperty('catch');
  });
});

describe('addRecords success', () => {
  const addRecordsResult = recordModule.addRecords(data.appID, data.recordsData);
  it('addRecords success should have a "ids" property', () => {
    return addRecordsResult.then((rsp) => {
      expect(rsp).toHaveProperty('ids');
    });
  });
});

describe('No param is specified, addRecords error', () => {
  const addRecordsResult = recordModule.addRecords();
  it('"addRecords" error should have a "id" property', () => {
    return addRecordsResult.catch((err) => {
      expect(err).toBeInstanceOf(KintoneExeption);
      expect(err.get()).toHaveProperty('id');
    });
  });
});
