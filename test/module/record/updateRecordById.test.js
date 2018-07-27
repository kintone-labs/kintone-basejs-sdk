
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
  recordID: 13,
  recordData: {
    Text_0: {
      value: 123
    }
  }
};

const recordModule = new KintoneRecord(conn);

describe('updateRecordById should have enough property', () => {
  const updateRecordByIdResult = recordModule.updateRecordById();
  it('updateRecordById should have a "then" property', () => {
    return expect(updateRecordByIdResult).toHaveProperty('then');
  });

  it('updateRecordById should have a "catch" property', () => {
    return expect(updateRecordByIdResult).toHaveProperty('catch');
  });
});

describe('updateRecordById success', () => {
  const updateRecordByIdResult = recordModule.updateRecordById(data.appID, data.recordID, data.recordData);
  it('updateRecordById success should have a "revision" property ', () => {
    return updateRecordByIdResult.then((rsp) => {
      expect(rsp).toHaveProperty('revision');
    });
  });
});

describe('No param is specified, updateRecordById error', () => {
  const updateRecordByIdResult = recordModule.updateRecordById();
  it('"updateRecordById" error should have a "id" property', () => {
    return updateRecordByIdResult.catch((err) => {
      expect(err).toBeInstanceOf(KintoneExeption);
      expect(err.get()).toHaveProperty('id');
    });
  });
});
