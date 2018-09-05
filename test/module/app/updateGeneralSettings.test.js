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

describe('updateGeneralSettings function', () => {
  describe('common function', () => {
    it('should return promise', () => {
      nock(URI)
        .put('/k/v1/preview/app/settings.json')
        .reply(200, {});

      const updateGeneralSettingsResult = appModule.updateGeneralSettings();
      expect(updateGeneralSettingsResult).toHaveProperty('then');
      expect(updateGeneralSettingsResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid request', () => {
      it('should get successfully the app views information', () => {
        const appId = 1;
        const genaralSetings = {
          'name': 'APP_NAME',
          'description': 'Here is app description.',
          'icon': {
            'type': 'PRESET',
            'key': 'APP72'
          },
          'theme': 'WHITE'
        };

        const expectBody = {
          'app': 1,
          'name': 'APP_NAME',
          'description': 'Here is app description.',
          'icon': {
            'type': 'PRESET',
            'key': 'APP72'
          },
          'theme': 'WHITE'
        };

        const expectResult = {
          'name': 'San Francisco Lunch Map',
          'description': 'A list of great places to go!',
          'icon': {
            'type': 'PRESET',
            'key': 'APP60'
          },
          'theme': 'WHITE',
          'revision': '24'
        };
        nock(URI)
          .put('/k/v1/preview/app/settings.json', (rqBody) => {
            expect(rqBody).toMatchObject(expectBody);
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
        const updateGeneralSettingsResult = appModule.updateGeneralSettings(appId, genaralSetings);
        return updateGeneralSettingsResult.then((rsp) => {
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
      it('should return error when the appID is unexist', () => {
        const appID = '444444';
        const expectResult = {
          'code': 'GAIA_AP01',
          'id': 'K45k0CEPV5802MKyPcu1',
          'message': 'The app (ID: 444444) not found. The app may have been deleted.'
        };

        nock(URI)
          .put('/k/v1/preview/app/settings.json', (rqBody) => {
            expect(rqBody.app).toEqual(appID);
            return true;
          })
          .reply(404, expectResult);
        const updateGeneralSettingsResult = appModule.updateGeneralSettings(appID);
        return updateGeneralSettingsResult.catch((err) => {
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
