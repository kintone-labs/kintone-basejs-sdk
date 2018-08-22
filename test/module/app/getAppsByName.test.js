
/**
 * kintone api - nodejs client
 * test app module
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

describe('getAppsByName function', () => {
  describe('common function', () => {
    it('should return promise', () => {
      const name = 'test';
      nock('https://' + config.domain)
        .get('/k/v1/apps.json')
        .reply(200, {});

      const getAppResult = recordModule.getAppsByName(name);
      expect(getAppResult).toHaveProperty('then');
      expect(getAppResult).toHaveProperty('catch');
    });
  });

  describe('success common', () => {
    describe('Valid request', () => {
      it('should return the app information based on the app name (without limit, offset)', () => {
        const name = 'Test';
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
        nock('https://' + config.domain)
          .get('/k/v1/apps.json', (rqBody) => {
            expect(rqBody.name).toEqual(name);
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
        const getAppsByNameByIDsResult = recordModule.getAppsByName(name);
        return getAppsByNameByIDsResult.then((rsp) => {
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
          .get('/k/v1/apps.json')
          .reply(403, expectResult);
        const getAppsResult = recordModule.getAppsByName('test');
        return getAppsResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
  /**
   * Todo: implement another success case
   */
  });
});

