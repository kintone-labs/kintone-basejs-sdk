
/**
 * kintone api - nodejs client
 * test app module
 */
const nock = require('nock');

const common = require('../../utils/common');

const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const App = require('../../../src/module/app/App');

const URI = 'https://' + common.DOMAIN;

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

const appModule = new App(conn);

describe('updateFormFields function', () => {
  describe('common function', () => {
    const app = 1;
    it('should return promise', () => {
      nock(URI)
        .put('/k/v1/preview/app/form/fields.json')
        .reply(200, {});

      const getAppResult = appModule.updateFormFields(app);
      expect(getAppResult).toHaveProperty('then');
      expect(getAppResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid request', () => {
      it('should update successfully the app formfield', () => {
        const data = {
          'app': 1,
          'properties': {
            'Text__single_line_1': {
              'type': 'SINGLE_LINE_TEXT',
              'code': 'Text__single_line_1',
              'label': 'Text (single-line)',
              'noLabel': false,
              'required': true
            }
          },
          revision: 2
        };
        const expectResult = {
          'revision': '1'
        };
        nock(URI)
          .put('/k/v1/preview/app/form/fields.json', (rqBody) => {
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

        const updateFormFieldsResult = appModule.updateFormFields(data.app, data.properties, data.revision);
        return updateFormFieldsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    /**
     * Todo: implement another success case
     */
  });

  describe('error case', () => {
    describe('using API token authentication', () => {
      const authToken = new Auth();
      authToken.setApiToken('a2386gf84gd663a12s32s');
      const connUsingToken = new Connection(common.DOMAIN, authToken);
      const appUsingtOKEN = new App(connUsingToken);

      it('should return error when using API token authentication ', () => {
        const expectResult = {'code': 'GAIA_NO01',
          'id': 'lzQPJ1hkW3Aj4iVebWCG',
          'message': 'Using this API token, you cannot run the specified API.'
        };
        nock(URI)
          .put('/k/v1/preview/app/form/fields.json')
          .matchHeader(common.API_TOKEN, (authHeader) => {
            expect(authHeader).toBe('a2386gf84gd663a12s32s');
            return true;
          })
          .reply(403, expectResult);
        const updateFormFieldsResult = appUsingtOKEN.updateFormFields(10);
        return updateFormFieldsResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
  });
  /**
     * Todo: implement another success case
  */
});
