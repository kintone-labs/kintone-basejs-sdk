
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

const recordModule = new Record(conn);

describe('getComments function', () => {
  describe('common case', () => {
    it('should return a promise', () => {
      const data = {
        app: 2,
        record: 1
      };
      nock('https://' + common.DOMAIN)
        .get('/k/v1/record/comments.json')
        .reply(200, {
          'comments': [
            {
              'id': '1',
              'text': 'user13 Global Sales APAC Taskforce \nHere is today\'s report.',
              'createdAt': '2016-05-09T18:27:54Z',
              'creator': {
                'code': 'user14',
                'name': 'user14'
              },
            }
          ],
          'older': false,
          'newer': false
        });
      const getCommentsResult = recordModule.getComments(data.app, data.record);
      expect(getCommentsResult).toHaveProperty('then');
      expect(getCommentsResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('valid data, app + record only', () => {
      it('should return correctly the comments of record,', () => {
        const data = {
          app: 2,
          record: 1
        };

        nock('https://' + common.DOMAIN)
          .get('/k/v1/record/comments.json', (rqBody) => {
            expect(rqBody.record).toEqual(data.record);
            expect(rqBody.app).toEqual(data.app);
            return true;
          })
          .matchHeader('X-Cybozu-Authorization', (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, {
            'comments': [
              {
                'id': '1',
                'text': 'user13 Global Sales APAC Taskforce \nHere is today\'s report.',
                'createdAt': '2016-05-09T18:27:54Z',
                'creator': {
                  'code': 'user14',
                  'name': 'user14'
                },
              }
            ],
            'older': false,
            'newer': false
          });
        const getCommentsResult = recordModule.getComments(data.app, data.record);
        return getCommentsResult.then((rsp) => {
          expect(rsp).toHaveProperty('comments');
        });
      });
    });
    /**
    * Todo: implement another success case
    */
  });

  describe('error case', () => {
    describe('order is invalid', () => {
      it('should return an error', () => {
        const data = {
          app: 2,
          record: 1,
          order: 'dd'
        };

        nock('https://' + common.DOMAIN)
          .get('/k/v1/record/comments.json', (rqBody) => {
            expect(rqBody.order).toEqual(data.order);
            return true;
          })
          .reply(400, {'code': 'CB_VA01',
            'id': 'Z8rWaqS8S8x8zfqoVLyt',
            'message': '入力内容が正しくありません。',
            'errors': {'order': {'messages': ['Enum値のいずれかでなければなりません。']}
            }});
        const getCommentsResult = recordModule.getComments(data.app, data.record, data.order);
        return getCommentsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
        });
      });
    });
  /**
  * Todo: implement another error case
  */
  });
});
