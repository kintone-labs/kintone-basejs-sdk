
/**
 * kintone api - nodejs client
 * test app module
 */
const nock = require('nock');

const config = require('../../config');
const common = require('../../common');

const KintoneAPIException = require('../../../src/exception/KintoneAPIException');
const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const Record = require('../../../src/module/app/App');

const auth = new Auth();
auth.setPasswordAuth(config.username, config.password);

const conn = new Connection(config.domain, auth);

const recordModule = new Record(conn);

describe('getApp function', () => {
  describe('common function', () => {
    it('should return promise', () => {
      const id = 1;
      nock('https://' + config.domain)
        .get('/k/v1/app.json')
        .reply(200, {});

      const getAppResult = recordModule.getApp(id);
      expect(getAppResult).toHaveProperty('then');
      expect(getAppResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid request', () => {
      it('should get successfully the app infomation', () => {
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
        nock('https://' + config.domain)
          .get('/k/v1/app.json', (rqBody) => {
            expect(rqBody.id).toEqual(appID);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(config.username, config.password));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, expectResult);
        const getAppResult = recordModule.getApp(appID);
        return getAppResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    /**
     * Todo: Implement another success case
     */
  });

  describe('error case', () => {
    describe('Invalid request', () => {
      it('should return error when using invalid app ID', () => {
        const appID = 0;
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'MJHWAlCKzzhtnWrTCrSY',
          'message': 'Missing or invalid input.',
          'errors': {'id': {'messages': ['must be greater than or equal to 1']}}
        };

        nock('https://' + config.domain)
          .get('/k/v1/app.json', (rqBody) => {
            expect(rqBody.id).toEqual(appID);
            return true;
          })
          .reply(400, expectResult);
        const getAppResult = recordModule.getApp(appID);
        return getAppResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });

      it('should return error when using unexist app ID', () => {
        const unexistAppID = 76666;
        const expectResult = {
          'code': 'GAIA_AP01',
          'id': '63aA2ILWtC6MuAf3pOgr',
          'message': 'The app (ID: 76666) not found. The app may have been deleted.'
        };

        nock('https://' + config.domain)
          .get('/k/v1/app.json', (rqBody) => {
            expect(rqBody.id).toEqual(unexistAppID);
            return true;
          })
          .reply(404, expectResult);
        const getAppResult = recordModule.getApp(unexistAppID);
        return getAppResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    /**
     * Todo: Implement another error case
     */
  });
});
