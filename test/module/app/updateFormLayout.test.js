
/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require('nock');

const common = require('../../common');

const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const Record = require('../../../src/module/app/App');

const URI = 'https://' + common.DOMAIN;
const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

const appModule = new Record(conn);

describe('updateFormLayout function', () => {
  describe('common function', () => {
    const app = 1;
    it('should return promise', () => {
      nock(URI)
        .put('/k/v1/preview/app/form/layout.json')
        .reply(200, {});

      const getAppResult = appModule.updateFormLayout(app);
      expect(getAppResult).toHaveProperty('then');
      expect(getAppResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid request', () => {
      it('should return the app formfield base on full data', () => {
        const data = {
          app: 1,
          'layout': [
            {
              'type': 'ROW',
              'fields': [
                {
                  'type': 'SINGLE_LINE_TEXT',
                  'code': 'Text__single_line_',
                  'size': {
                    'width': '200'
                  }
                }
              ]

            }],
          revision: 1
        };
        const expectResult = {
          'revision': '2'
        };
        nock(URI)
          .put('/k/v1/preview/app/form/layout.json', (rqBody) => {
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

        const updateFormLayoutResult = appModule.updateFormLayout(data.app, data.layout, data.revision);
        return updateFormLayoutResult.then((rsp) => {
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
      it('should return error when using API token authentication ', () => {
        const expectResult = {'code': 'GAIA_NO01',
          'id': 'lzQPJ1hkW3Aj4iVebWCG',
          'message': 'Using this API token, you cannot run the specified API.'
        };
        nock(URI)
          .put('/k/v1/preview/app/form/layout.json')
          .reply(520, expectResult);
        const updateFormLayoutResult = appModule.updateFormLayout(10);
        return updateFormLayoutResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    /**
     * Todo: implement another success case
     */
  });
});
