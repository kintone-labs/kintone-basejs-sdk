
/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require('nock');

const common = require('../../common');

const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const Record = require('../../../src/module/app/App');

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

const recordModule = new Record(conn);

describe('getFormFields function', () => {
  describe('common function', () => {
    const app = 1;
    it('should return promise', () => {
      nock('https://' + common.DOMAIN)
        .get('/k/v1/app/form/fields.json')
        .reply(200, {});

      const getAppResult = recordModule.getFormFields(app);
      expect(getAppResult).toHaveProperty('then');
      expect(getAppResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid request', () => {
      it('should return the app formfield base on full data', () => {
        const app = 10;
        const lang = 'EN';
        const isPreview = false;
        const expectResult = {
          'properties': {
            'Text__single_line_1': {
              'type': 'SINGLE_LINE_TEXT',
              'code': 'Text__single_line_1',
              'label': 'Text (single-line)',
              'noLabel': false,
              'required': true,
              'unique': true,
              'maxLength': '64',
              'minLength': '0',
              'defaultValue': '',
              'expression': '',
              'hideExpression': false
            },
            'revision': '2'
          }};
        nock('https://' + common.DOMAIN)
          .get('/k/v1/app/form/fields.json', (rqBody) => {
            expect(rqBody.app).toEqual(app);
            expect(rqBody.lang).toEqual(lang);
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

        const getFormFieldsResult = recordModule.getFormFields(app, lang, isPreview);
        return getFormFieldsResult.then((rsp) => {
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
        nock('https://' + common.DOMAIN)
          .get('/k/v1/app/form/fields.json')
          .reply(403, expectResult);
        const getFormFieldsResult = recordModule.getFormFields(10);
        return getFormFieldsResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    /**
     * Todo: implement another success case
     */
  });
});
