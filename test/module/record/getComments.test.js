
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

describe('getComments should have enough property', () => {
  const getCommentsResult = recordModule.getComments();
  it('getComments should have a "then" property', () => {
    return expect(getCommentsResult).toHaveProperty('then');
  });

  it('getComments should have a "catch" property', () => {
    return expect(getCommentsResult).toHaveProperty('catch');
  });
});

describe('getComments success', () => {
  const getCommentsResult = recordModule.getComments(data.appID, data.recordID);
  it('getComments success should have a "comments" property', () => {
    return getCommentsResult.then((rsp) => {
      expect(rsp).toHaveProperty('comments');
    });
  });
});

describe('No param is specified, getComments error', () => {
  const getCommentsResult = recordModule.getComments('');
  it('"getComments" error should have a "id" property', () => {
    return getCommentsResult.catch((err) => {
      expect(err).toBeInstanceOf(KintoneExeption);
      expect(err.get()).toHaveProperty('id');
    });
  });
});
