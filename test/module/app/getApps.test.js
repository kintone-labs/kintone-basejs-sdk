
/**
 * kintone api - nodejs client
 * test app module
 */
const nock = require('nock');

const common = require('../../utils/common');

const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const App = require('../../../src/module/app/App');

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

const appModule = new App(conn);

describe('getApps function', () => {
  describe('common function', () => {
    it('should return promise', () => {
      nock('https://' + common.DOMAIN)
        .get('/k/v1/apps.json')
        .reply(200, {});

      const getAppResult = appModule.getApps();
      expect(getAppResult).toHaveProperty('then');
      expect(getAppResult).toHaveProperty('catch');
    });
  });
  describe('success case', () => {
    describe('Valid request', () => {
      it('[App module-8] - should return the app information based on the limit', () => {
        const limit = 10;
        const offset = 0;
        const expectResult = {
          'apps': [
            {
              'appId': '1',
              'code': 'task',
              'name': 'My Test App',
              'description': 'Testing this app',
              'spaceId': null,
              'threadId': null,
              'createdAt': '2014-06-02T05:14:05.000Z',
              'creator': {
                'code': 'user1',
                'name': 'user1'
              },
              'modifiedAt': '2014-06-02T05:14:05.000Z',
              'modifier': {
                'code': 'user1',
                'name': 'user1'
              }
            }
          ]
        };
        nock('https://' + common.DOMAIN)
          .get('/k/v1/apps.json', (rqBody) => {
            expect(rqBody.limit).toEqual(limit);
            expect(rqBody.offset).toEqual(offset);
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
        const getAppsResult = appModule.getApps(offset, limit);
        return getAppsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    /**
     * Todo: implement another success case
     */
    /**
     * Guest space app
     */
    it('[App module-12] - should return the app information of guest space', () => {
      const limit = 10;
      const offset = 0;
      const connGuest = new Connection(common.DOMAIN, auth, common.GUEST_SPACEID);
      const appModuleGuest = new App(connGuest);
      const expectResult = {
        'apps': [
          {
            'appId': '1',
            'code': 'task',
            'name': 'My Test App',
            'description': 'Testing this app',
            'spaceId': null,
            'threadId': null,
            'createdAt': '2014-06-02T05:14:05.000Z',
            'creator': {
              'code': 'user1',
              'name': 'user1'
            },
            'modifiedAt': '2014-06-02T05:14:05.000Z',
            'modifier': {
              'code': 'user1',
              'name': 'user1'
            }
          }
        ]
      };
      nock('https://' + common.DOMAIN)
        .get('/k/v1/apps.json', (rqBody) => {
          expect(rqBody.limit).toEqual(limit);
          expect(rqBody.offset).toEqual(offset);
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
      const getAppsResult = appModuleGuest.getApps(offset, limit);
      return getAppsResult.then((rsp) => {
        expect(rsp).toMatchObject(expectResult);
      });
    });
    /**
     * Verify when not specifying the limit, the default limit value is 100
     */
    it('[App module-16] - should return the app information when not specifying the limit, the default limit value is 100', () => {
      const limit = null;
      const offset = 0;
      const expectResult = {
        'apps': [
          {
            'appId': '1',
            'code': 'task',
            'name': 'My Test App',
            'description': 'Testing this app',
            'spaceId': null,
            'threadId': null,
            'createdAt': '2014-06-02T05:14:05.000Z',
            'creator': {
              'code': 'user1',
              'name': 'user1'
            },
            'modifiedAt': '2014-06-02T05:14:05.000Z',
            'modifier': {
              'code': 'user1',
              'name': 'user1'
            }
          }
        ]
      };
      nock('https://' + common.DOMAIN)
        .get('/k/v1/apps.json', (rqBody) => {
          expect(rqBody.limit).toEqual(limit);
          expect(rqBody.offset).toEqual(offset);
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
      const getAppsResult = appModule.getApps(offset, limit);
      return getAppsResult.then((rsp) => {
        expect(rsp).toMatchObject(expectResult);
      });
    });
    /**
    * Verify when not specifying the offset, the default offset value is 0
    */
    it('[App module-17] - should return the app information when not specifying the limit, the default limit value is 100', () => {
      const limit = 10;
      const offset = null;
      const expectResult = {
        'apps': [
          {
            'appId': '1',
            'code': 'task',
            'name': 'My Test App',
            'description': 'Testing this app',
            'spaceId': null,
            'threadId': null,
            'createdAt': '2014-06-02T05:14:05.000Z',
            'creator': {
              'code': 'user1',
              'name': 'user1'
            },
            'modifiedAt': '2014-06-02T05:14:05.000Z',
            'modifier': {
              'code': 'user1',
              'name': 'user1'
            }
          }
        ]
      };
      nock('https://' + common.DOMAIN)
        .get('/k/v1/apps.json', (rqBody) => {
          expect(rqBody.limit).toEqual(limit);
          expect(rqBody.offset).toEqual(offset);
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
      const getAppsResult = appModule.getApps(offset, limit);
      return getAppsResult.then((rsp) => {
        expect(rsp).toMatchObject(expectResult);
      });
    });
  });
  describe('error case', () => {
    describe('using API token authentication', () => {
      it('[App module-7] - should return error when using API token authentication ', () => {
        const expectResult = {
          'code': 'GAIA_NO01',
          'id': 'lzQPJ1hkW3Aj4iVebWCG',
          'message': 'Using this API token, you cannot run the specified API.'
        };
        nock('https://' + common.DOMAIN)
          .get('/k/v1/apps.json')
          .reply(403, expectResult);
        const getAppsResult = appModule.getApps();
        return getAppsResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    /**
     * Todo: implement another error case
     */
    /**
 * Verify the error will be displayed when input 0 to the limit
 */
    it('[App module-13] - should return an error when the param limit has value of 0', () => {
      const limit = 0;
      const offset = 0;
      const expectedResult = {
        code: 'CB_VA01',
        id: 'u5raHo9ugggi6JhuwaBN',
        message: '入力内容が正しくありません。',
        errors: {
          limit: {
            messages: ['最小でも1以上です。']
          }
        }
      };
      nock('https://' + common.DOMAIN)
        .get('/k/v1/apps.json', reqBody => {
          expect(reqBody.limit).toEqual(0);
          return true;
        })
        .reply(400, expectedResult);

      const getAppsResult = appModule.getApps(offset, limit);
      return getAppsResult.catch(err => {
        expect(err.get()).toMatchObject(expectedResult);
      });
    });
    /**
     * Verify the error will be displayed when input number > 100 to the limit
     */
    it('[App module-14] - should return an error when the param limit has value greater than 100', () => {
      const limit = 1000;
      const offset = 0;
      const expectedResult = {
        code: 'CB_VA01',
        id: 'rhfkAm75Cs0AJw0jpUU3',
        message: '入力内容が正しくありません。',
        errors: {
          limit: {
            messages: ['最大でも100以下です。']
          }
        }
      };
      nock('https://' + common.DOMAIN)
        .get('/k/v1/apps.json', reqBody => {
          expect(reqBody.limit).toBeGreaterThan(100);
          return true;
        })
        .reply(400, expectedResult);

      const getAppsResult = appModule.getApps(offset, limit);
      return getAppsResult.catch(err => {
        expect(err.get()).toMatchObject(expectedResult);
      });
    });
    /**
     * Verify the error will be displayed when input < 0 to the offset
     */
    it('[App module-15] - should return an error when the param offset has value less than 0', () => {
      const limit = 10;
      const offset = -10;
      const expectedResult = {
        code: 'CB_VA01',
        id: 'k6cykYqDofAjHMmq40w1',
        message: '入力内容が正しくありません。',
        errors: {
          offset: {
            messages: ['最小でも0以上です。']
          }
        }
      };
      nock('https://' + common.DOMAIN)
        .get('/k/v1/apps.json', reqBody => {
          expect(reqBody.offset).toBeLessThan(0);
          return true;
        })
        .reply(400, expectedResult);

      const getAppsResult = appModule.getApps(offset, limit);
      return getAppsResult.catch(err => {
        expect(err.get()).toMatchObject(expectedResult);
      });
    });
    /**
     * Verify the error will be displayed when input > 2147483647 to the offset
     */
    it('[App module-18] - should return an error when the param offset has value greater than max value 2147483647', () => {
      const limit = 10;
      const offset = 2147483648;
      const expectedResult = {
        code: 'CB_VA01',
        id: 'OcOVMlF0yn6jSkvKctSI',
        message: '入力内容が正しくありません。',
        errors: {
          offset: {
            messages: ['最大でも2,147,483,647以下です。']
          }
        }
      };
      nock('https://' + common.DOMAIN)
        .get('/k/v1/apps.json', rqBody => {
          expect(rqBody.offset).toEqual(offset);
          return true;
        })
        .reply(400, expectedResult);

      const getAppsResult = appModule.getApps(offset, limit);
      return getAppsResult.catch(err => {
        expect(err.get()).toMatchObject(expectedResult);
      });
    });
    /**
     * Verify the error will be displayed when input > 2147483647 to limit
     */
    it('[App module-19] - should return an error when the param limit has value greater than max value 2147483647', () => {
      const limit = 2147483648;
      const offset = 0;
      const expectedResult = {};
      nock('https://' + common.DOMAIN)
        .get('/k/v1/apps.json', rqBody => {
          expect(rqBody.limit).toEqual(limit);
          return true;
        })
        .reply(400, expectedResult);

      const getAppsResult = appModule.getApps(offset, limit);
      return getAppsResult.catch(err => {
        expect(err.get()).toMatchObject(expectedResult);
      });
    });
  });
});