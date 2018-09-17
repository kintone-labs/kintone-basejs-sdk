
/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require('nock');

const common = require('../../utils/common');

const KintoneAPIException = require('../../../src/exception/KintoneAPIException');
const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const Record = require('../../../src/module/record/Record');

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);
if (common.hasOwnProperty('proxy') && common.proxy) {
  conn.addRequestOption('proxy', common.proxy);
}

describe('deleteComment function', () => {
  describe('common case', () => {
    it('should return a promisse', () => {
      nock('https://' + common.DOMAIN)
        .intercept('/k/v1/record/comment.json', 'DELETE')
        .reply(200, {});

      const recordModule = new Record(conn);
      const deleteCommentResult = recordModule.deleteComment();
      expect(deleteCommentResult).toHaveProperty('then');
      expect(deleteCommentResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('appID, recordID, commentID params are specified', () => {
      it('should return an empty Json', () => {
        const data = {
          app: 1,
          record: 1,
          comment: 1
        };

        nock('https://' + common.DOMAIN)
          .intercept('/k/v1/record/comment.json', 'DELETE', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, {});

        const recordModule = new Record(conn);
        const deleteCommentResult = recordModule.deleteComment(data.app, data.record, data.comment);

        return deleteCommentResult.then((rsp) => {
          expect(rsp).toEqual({});
        });
      });
    });
    /**
    * Todo: implement another success case
    */
  });

  describe('error case', () => {
    describe('invalid comment id', () => {
      it('should return error when the comment is invalid', () => {
        const data = {
          app: 1,
          record: 1,
          comment: 444
        };
        nock('https://' + common.DOMAIN)
          .intercept('/k/v1/record/comment.json', 'DELETE', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .reply(520, {'code': 'GAIA_RE02', 'id': '3wYeQRwubqOzNISfmYSZ', 'message': '指定したコメントが存在しません。削除された可能性があります。'});

        const recordModule = new Record(conn);
        const deleteCommentResult = recordModule.deleteComment(data.app, data.record, data.comment);

        return deleteCommentResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
        });
      });
    });
    /**
    * Todo: implement another error case
    */
  });
});
