
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

describe('addComment function', () => {
  describe('common case', () => {
    it('should return a promise', () => {

      nock('https://' + common.DOMAIN)
        .post('/k/v1/record/comment.json')
        .reply(200, {'id': '1'});
      const recordModule = new Record(conn);
      const addCommentResult = recordModule.addComment();
      expect(addCommentResult).toHaveProperty('then');
      expect(addCommentResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('valid data', () => {
      const data = {
        app: 1,
        record: 1,
        comment: {
          text: 'hello'
        }
      };

      nock('https://' + common.DOMAIN)
        .post('/k/v1/record/comment.json', (rqBody) => {
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
        .reply(200, {'id': '1'});

      const recordModule = new Record(conn);
      const addCommentResult = recordModule.addComment(data.app, data.record, data.comment);
      it('should add comment to record successfully', () => {
        return addCommentResult.then((rsp) => {
          expect(rsp).toHaveProperty('id');
        });
      });
    });
    /**
    * Todo: implement another success case
    */
  });

  describe('error case', () => {
    describe('invalid comment content', () => {
      const data = {
        app: 1,
        record: 1,
        comment: {
          text: ''
        }
      };
      const expectResult = {'code': 'CB_VA01',
        'id': '7oiYHOZd11fTpyvY00kG',
        'message': 'Missing or invalid input.',
        'errors': {'comment.text': {'messages': ['Enter between 1 and 65,535 characters.', 'Required field.']}}
      };
      nock('https://' + common.DOMAIN)
        .post('/k/v1/record/comment.json', (rqBody) => {
          expect(rqBody).toMatchObject(data);
          return true;
        })
        .reply(400, expectResult);

      const recordModule = new Record(conn);
      const addCommentResult = recordModule.addComment(data.app, data.record, data.comment);
      it('should return error when the comment text is blank', () => {
        return addCommentResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    /**
    * Todo: implement more case
    */
  });
});
