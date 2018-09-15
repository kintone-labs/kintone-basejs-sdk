
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

describe('addRecord function', () => {
  describe('common case', () => {
    it('should return a promise', () => {
      nock('https://' + common.DOMAIN)
        .post('/k/v1/record.json')
        .reply(200, {'id': '100', 'revision': '1'});
      const recordModule = new Record(conn);
      const addRecordResult = recordModule.addRecord();
      expect(addRecordResult).toHaveProperty('then');
      expect(addRecordResult).toHaveProperty('catch');
    });
  // todo
  });

  describe('success case', () => {
    describe('valid Data', () => {
      const body = {
        appID: 1,
        recordData: {
          Dropdown: {value: 1},
          Text: {value: 'test'},
          Number: {value: 1}
        }
      };

      it('should add successfully with full data', () => {
        nock('https://' + common.DOMAIN)
          .post('/k/v1/record.json', (rqBody) => {
            expect(rqBody.record).toMatchObject(body.recordData);
            return rqBody.app === body.appID;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, {'id': '100', 'revision': '1'});
        const recordModule = new Record(conn);
        return recordModule.addRecord(body.appID, body.recordData)
          .then(rsp => {
            expect(rsp).toHaveProperty('id');
            expect(rsp).toHaveProperty('revision');
          });
      });
    });
    /**
    * Todo: implement another success case
    */
  });

  describe('error case', () => {
    describe('invalid appID', () => {
      it('should return error when using unexisted appID', () => {
        const unexistedAppID = 999;
        const expectResult = {
          'code': 'GAIA_AP01',
          'id': 'id when request to invalid app',
          'message': 'The app (ID: 999) not found. The app may have been deleted.'
        };
        nock('https://' + common.DOMAIN, (rqBody) => {
          expect(rqBody.app).toEqual(unexistedAppID);
          return true;
        })
          .post('/k/v1/record.json')
          .reply(404, expectResult);

        const recordModule = new Record(conn);
        return recordModule.addRecord(unexistedAppID)
          .catch(err => {
            expect(err.get()).toHaveProperty('id');
            expect(err.get().code).toEqual(expectResult.code);
            expect(err.get().message).toEqual(expectResult.message);
          });
      });
      it('should return error when using negative appID', () => {
        const negativeAppID = -1;
        const expectResult = {
          'code': 'CB_VA01',
          'id': '0hjc1OJbmY29cl2SoDey',
          'message': 'Missing or invalid input.',
          'errors': {'app':
           {'messages': ['must be greater than or equal to 1']
           }
          }
        };
        nock('https://' + common.DOMAIN)
          .post('/k/v1/record.json')
          .reply(400, expectResult);

        const recordModule = new Record(conn);
        return recordModule.addRecord(negativeAppID)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });
      it('should return error when appID is 0', () => {
        const appID = 0;
        const expectResult = {
          'code': 'CB_VA01',
          'id': '0hjc1OJbmY29cl2SoDey',
          'message': 'Missing or invalid input.',
          'errors': {'app':
           {'messages': ['must be greater than or equal to 1']
           }
          }
        };
        nock('https://' + common.DOMAIN)
          .post('/k/v1/record.json')
          .reply(400, expectResult);

        const recordModule = new Record(conn);
        return recordModule.addRecord(appID)
          .catch(err => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toMatchObject(expectResult);
          });
      });
    });
    /**
    * Todo: implement another error case
    */
  });
});
