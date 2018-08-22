
/**
 * kintone api - nodejs client
 * test record module
 */

const KintoneExeption = require('../../../src/exception/KintoneAPIException');
const KintoneConnection = require('../../../src/connection/Connection');
const KintoneAuth = require('../../../src/authentication/Auth');
const KintoneRecord = require('../../../src/module/record/Record');
const config = require('../../config');
const nock = require('nock');
const Common = require('../../Common');

const common = new Common();

const auth = new KintoneAuth();
auth.setPasswordAuth(config.username, config.password);

const conn = new KintoneConnection(config.domain, auth);
if (config.hasOwnProperty('proxy') && config.proxy) {
  conn.addRequestOption('proxy', config.proxy);
}

describe('addComment function', () => {
  describe('common case', () => {
    it('should return a promise', () => {

      nock('https://' + config.domain)
        .post('/k/v1/record/comment.json')
        .reply(200, {'id': '1'});
      const recordModule = new KintoneRecord(conn);
      const addCommentResult = recordModule.addComment();
      expect(addCommentResult).toHaveProperty('then');
      expect(addCommentResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('valid data', () => {
      const data = {
        app: config.app,
        record: 1,
        comment: {
          text: 'hello'
        }
      };

      nock('https://' + config.domain)
        .post('/k/v1/record/comment.json', (rqBody) => {
          expect(rqBody).toMatchObject(data);
          return true;
        })
        .matchHeader('X-Cybozu-Authorization', (authHeader) => {
          expect(authHeader).toBe(common.getPasswordAuth(config.username, config.password));
          return true;
        })
        .matchHeader('Content-Type', (type) => {
          expect(type).toBe('application/json');
          return true;
        })
        .reply(200, {'id': '1'});

      const recordModule = new KintoneRecord(conn);
      const addCommentResult = recordModule.addComment(data.app, data.record, data.comment);
      it('should add comment to record successfully', () => {
        return addCommentResult.then((rsp) => {
          expect(rsp).toHaveProperty('id');
        });
      });
    // todo
    });
  // todo
  });

  describe('error case', () => {
    describe('invalid comment content', () => {
      const data = {
        app: config.app,
        record: 1,
        comment: {
          text: 'hello'
        }
      };
      const expectResult = common.getMissingOrInvalidInputResp();
      nock('https://' + config.domain)
        .post('/k/v1/record/comment.json', (rqBody) => {
          expect(rqBody).toMatchObject(data);
          return true;
        })
        .reply(400, expectResult);

      const recordModule = new KintoneRecord(conn);
      const addCommentResult = recordModule.addComment(data.app, data.record, data.comment);
      it('should return error when the comment text is blank', () => {
        return addCommentResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneExeption);
          expect(err.get()).toHaveProperty('id');
          expect(err.get().code).toEqual(expectResult.code);
          expect(err.get().message).toEqual(expectResult.message);
        });
      });
      // todo
    });
    // todo
  });
});
