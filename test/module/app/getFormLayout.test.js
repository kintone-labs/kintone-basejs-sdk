
/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require('nock');

const config = require('../../config');
const common = require('../../common');

const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const Record = require('../../../src/module/app/App');

const auth = new Auth();
auth.setPasswordAuth(config.username, config.password);

const conn = new Connection(config.domain, auth);

const recordModule = new Record(conn);

describe('getFormLayout function', () => {
  describe('common function', () => {
    const app = 1;
    it('should return promise', () => {
      nock('https://' + config.domain)
        .get('/k/v1/app/form/layout.json')
        .reply(200, {});

      const getAppResult = recordModule.getFormLayout(app);
      expect(getAppResult).toHaveProperty('then');
      expect(getAppResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid request', () => {
      it('should return the app formfield base on full data', () => {
        const app = 10;
        const isPreview = false;
        const expectResult = {
          'revision': '2',
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
            }
          ]
        };
        nock('https://' + config.domain)
          .get('/k/v1/app/form/layout.json', (rqBody) => {
            expect(rqBody.app).toEqual(app);
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

        const getFormLayoutResult = recordModule.getFormLayout(app, isPreview);
        return getFormLayoutResult.then((rsp) => {
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
        nock('https://' + config.domain)
          .get('/k/v1/app/form/layout.json')
          .reply(403, expectResult);
        const getFormLayoutResult = recordModule.getFormLayout(10);
        return getFormLayoutResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    /**
     * Todo: implement another success case
     */
  });
});
