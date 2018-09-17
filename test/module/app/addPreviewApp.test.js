
/**
 * kintone api - nodejs client
 * test app module
 */
const nock = require('nock');

const common = require('../../utils/common');

const KintoneAPIException = require('../../../src/exception/KintoneAPIException');
const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const App = require('../../../src/module/app/App');

const URI = 'https://' + common.DOMAIN;

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

const appModule = new App(conn);

describe('addPreviewApp function', () => {
  describe('common function', () => {
    it('should return promise', () => {
      nock(URI)
        .post('/k/v1/preview/app.json')
        .reply(200, {});

      const addPreviewAppResult = appModule.addPreviewApp();
      expect(addPreviewAppResult).toHaveProperty('then');
      expect(addPreviewAppResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid request', () => {
      it('should add successfully a new app', () => {
        const data = {
          name: 'app 1',
          space: 1,
          thread: 1
        };
        const expectResult = {
          'app': '23',
          'revision': '1'
        };
        nock(URI)
          .post('/k/v1/preview/app.json', (rqBody) => {
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
          .reply(200, expectResult);
        const addPreviewAppResult = appModule.addPreviewApp(data.name, data.space, data.thread);
        return addPreviewAppResult.then((rsp) => {
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
      it('should return error when do not specify app name', () => {
        const expectResult = {
          'code': 'CB_IL02',
          'id': 'iOkw3TbL1ZU07tU9hSof',
          'message': 'Illegal request.'
        };

        nock(URI)
          .post('/k/v1/preview/app.json', (rqBody) => {
            expect(rqBody).toEqual({});
            return true;
          })
          .reply(520, expectResult);
        const addPreviewAppResult = appModule.addPreviewApp();
        return addPreviewAppResult.catch((err) => {
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
