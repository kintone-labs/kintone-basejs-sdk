
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
  recordID: 2,
  commentContent: {
    text: 'hello'
  }
};

const recordModule = new KintoneRecord(conn);

describe('addComment should have enough property', () => {
  const addCommentResult = recordModule.addComment();
  it('addComment should have a "then" property', () => {
    return expect(addCommentResult).toHaveProperty('then');
  });

  it('addComment should have a "catch" property', () => {
    return expect(addCommentResult).toHaveProperty('catch');
  });
});

describe('addComment success', () => {
  const addCommentResult = recordModule.addComment(data.appID, data.recordID, data.commentContent);
  it('addComment success should have a "id" property', () => {
    return addCommentResult.then((rsp) => {
      expect(rsp).toHaveProperty('id');
    });
  });
});

describe('No param is specified, addComment error', () => {
  const addCommentResult = recordModule.addComment('');
  it('"addComment" error should have a "id" property', () => {
    return addCommentResult.catch((err) => {
      expect(err).toBeInstanceOf(KintoneExeption);
      expect(err.get()).toHaveProperty('id');
    });
  });
});
