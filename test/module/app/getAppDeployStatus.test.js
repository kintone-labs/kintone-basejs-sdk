
/**
 * kintone api - nodejs client
 * test app module
 */
const nock = require('nock');

const common = require('../../common');

const KintoneAPIException = require('../../../src/exception/KintoneAPIException');
const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const App = require('../../../src/module/app/App');

const URI = 'https://' + common.DOMAIN;

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

const appModule = new App(conn);

describe('getAppDeployStatus function', () => {
  describe('common function', () => {
    it('should return promise', () => {
      nock(URI)
        .get('/k/v1/preview/app/deploy.json')
        .reply(200, {});

      const getAppDeployStatusResult = appModule.getAppDeployStatus();
      expect(getAppDeployStatusResult).toHaveProperty('then');
      expect(getAppDeployStatusResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid request', () => {
      it('should get successfully the app deploy status', () => {
        const data = {
          'apps': [1, 2]
        };
        nock(URI)
          .get('/k/v1/preview/app/deploy.json', (rqBody) => {
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
        const getAppDeployStatusResult = appModule.getAppDeployStatus(data.apps);
        return getAppDeployStatusResult.then((rsp) => {
          expect(rsp).toMatchObject({});
        });
      });
    });
    /**
     * Todo: Implement another success case
     */
  });

  describe('error case', () => {
    describe('Invalid request', () => {
      it('should return error when the appId is unexist', () => {
        const data = {
          'apps': [444444]
        };
        const expectResult = {
          'code': 'GAIA_AP01',
          'id': 'K45k0CEPV5802MKyPcu1',
          'message': 'The app (ID: 444444) not found. The app may have been deleted.'
        };

        nock(URI)
          .get('/k/v1/preview/app/deploy.json', (rqBody) => {
            expect(rqBody).toEqual(data);
            return true;
          })
          .reply(404, expectResult);
        const getAppDeployStatusResult = appModule.getAppDeployStatus(data.apps);
        return getAppDeployStatusResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
  });
  /**
     * Todo: Implement another error case
     */
});
