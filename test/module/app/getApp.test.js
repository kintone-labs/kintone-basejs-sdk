
/**
 * kintone api - nodejs client
 * test app module
 */
const nock = require('nock');

const common = require('../../common');

const KintoneAPIException = require('../../../src/exception/KintoneAPIException');
const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const Record = require('../../../src/module/app/App');

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);
const appModule = new Record(conn);

describe('getApp function', () => {
  describe('common function', () => {
    it('should return promise', () => {
      const id = 1;
      nock('https://' + common.DOMAIN)
        .get('/k/v1/app.json')
        .reply(200, {});

      const getAppResult = appModule.getApp(id);
      expect(getAppResult).toHaveProperty('then');
      expect(getAppResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid request', () => {
      it('[App module-3] - should get successfully the app infomation', () => {
        const appID = 1;
        const expectResult = {
          'appId': '1',
          'code': '',
          'name': 'ToDo App',
          'description': 'This is a great app!',
          'spaceId': '2',
          'threadId': '3',
          'createdAt': '2015-03-06T02:24:03.000Z',
          'creator': {
            'code': 'user1',
            'name': 'User1'
          },
          'modifiedAt': '2015-03-06T03:06:57.000Z',
          'modifier': {
            'code': 'login-name',
            'name': 'Display Name'
          }
        };
        nock('https://' + common.DOMAIN)
          .get('/k/v1/app.json', (rqBody) => {
            expect(rqBody.id).toEqual(appID);
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
          .reply(200, expectResult);
        const getAppResult = appModule.getApp(appID);
        return getAppResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    /**
     * Todo: Implement another success case
     */
    /**
     * Guest space app
     */
    it('[App module-4] - should get successfully the app infomation in guest space', () => {
      const appID = 1;
      const connGuest = new Connection(common.DOMAIN, auth, common.GUEST_SPACEID);
      const appModuleGuest = new Record(connGuest);
      const expectResult = {
        'appId': appID,
        'code': '',
        'name': 'kintoneUtility - GuestApp',
        'description': '<div><br /></div>',
        'createdAt': '2018-07-13T08:56:33.000Z',
        'creator': {
          'code': 'cybozu',
          'name': 'cybozu'
        },
        'modifiedAt': '2018-08-03T04:10:37.000Z',
        'modifier': {
          'code': 'cybozu',
          'name': 'cybozu'
        },
        'spaceId': '4',
        'threadId': '4'
      };
      nock('https://' + common.DOMAIN)
        .get('/k/v1/app.json', (rqBody) => {
          expect(rqBody.id).toEqual(appID);
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
        .reply(200, expectResult);
      const getAppResult = appModuleGuest.getApp(appID);
      return getAppResult.then((rsp) => {
        expect(rsp).toMatchObject(expectResult);
      });
    });
  });

  describe('error case', () => {
    describe('Invalid request', () => {
      it('[App module-5] - should return error when using invalid app ID', () => {
        const appID = 0;
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'MJHWAlCKzzhtnWrTCrSY',
          'message': 'Missing or invalid input.',
          'errors': { 'id': { 'messages': ['must be greater than or equal to 1'] } }
        };

        nock('https://' + common.DOMAIN)
          .get('/k/v1/app.json', (rqBody) => {
            expect(rqBody.id).toEqual(appID);
            return true;
          })
          .reply(400, expectResult);
        const getAppResult = appModule.getApp(appID);
        return getAppResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });

      it('[App module-6] - should return error when using unexist app ID', () => {
        const unexistAppID = 766666;
        const expectResult = {
          'code': 'GAIA_AP01',
          'id': '63aA2ILWtC6MuAf3pOgr',
          'message': 'The app (ID: 76666) not found. The app may have been deleted.'
        };

        nock('https://' + common.DOMAIN)
          .get('/k/v1/app.json', (rqBody) => {
            expect(rqBody.id).toEqual(unexistAppID);
            return true;
          })
          .reply(404, expectResult);
        const getAppResult = appModule.getApp(unexistAppID);
        return getAppResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
      /**
     * Todo: Implement another error case
     */
      /**
       * API Token Authentication
       * Error happens when running the command with API token as it is not supported yet
       */
      it('[App module-2] - should return error when using API token authentication ', () => {
        const appID = 31;
        const expectResult = {
          code: 'GAIA_NO01',
          id: 'lzQPJ1hkW3Aj4iVebWCG',
          message: 'Using this API token, you cannot run the specified API.'
        };
        nock('https://' + common.DOMAIN)
          .get('/k/v1/app.json', (rqBody) => {
            expect(rqBody.id).toEqual(appID);
            return true;
          })
          .reply(403, expectResult);
        const getAppResult = appModule.getApp(appID);
        return getAppResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
  });
});
