
/**
 * kintone api - nodejs client
 * test app module
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

describe('getAppsByIDs function', () => {
  describe('common function', () => {
    it('should return promise', () => {
      const ids = [1];
      nock('https://' + common.DOMAIN)
        .get('/k/v1/apps.json')
        .reply(200, {});

      const getAppResult = recordModule.getAppsByIDs(ids);
      expect(getAppResult).toHaveProperty('then');
      expect(getAppResult).toHaveProperty('catch');
    });
  });

  describe('success common', () => {
    describe('Valid request', () => {
      it('should return the app information based on the list of id (without limit, offset)', () => {
        const appIds = [1];
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
            expect(rqBody.ids).toEqual(appIds);
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
        const getAppsByIDsByIDsResult = recordModule.getAppsByIDs(appIds);
        return getAppsByIDsByIDsResult.then((rsp) => {
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
          .get('/k/v1/apps.json')
          .reply(403, expectResult);
        const getAppsResult = recordModule.getAppsByIDs([1]);
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

