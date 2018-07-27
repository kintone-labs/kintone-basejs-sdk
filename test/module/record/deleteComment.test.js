
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
  commentID: 1
};

const recordModule = new KintoneRecord(conn);

describe('deleteComment should have enough property', () => {
  const deleteCommentResult = recordModule.deleteComment();
  it('deleteComment should have a "then" property', () => {
    return expect(deleteCommentResult).toHaveProperty('then');
  });

  it('deleteComment should have a "catch" property', () => {
    return expect(deleteCommentResult).toHaveProperty('catch');
  });
});

describe('deleteComment success', () => {
  const deleteCommentResult = recordModule.deleteComment(data.appID, data.recordID, data.commentID);
  it('deleteComment success should return an empty Json', () => {
    return deleteCommentResult.then((rsp) => {
      expect(rsp).toEqual({});
    });
  });
});

describe('No param is specified, deleteComment error', () => {
  const deleteCommentResult = recordModule.deleteComment('');
  it('"deleteComment" error should have a "id" property', () => {
    return deleteCommentResult.catch((err) => {
      expect(err).toBeInstanceOf(KintoneExeption);
      expect(err.get()).toHaveProperty('id');
    });
  });
});
