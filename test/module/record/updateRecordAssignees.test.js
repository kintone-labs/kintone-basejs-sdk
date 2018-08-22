
/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require('nock');

const common = require('../../common');

const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const Record = require('../../../src/module/record/Record');

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

describe('updateRecordAssignees function', () => {
  describe('common case', () => {
    const data = {
      app: 1,
      id: 1,
      assignees: ['user1'],
      revision: 2
    };

    it('should return a promise', () => {
      nock('https://' + common.DOMAIN)
        .put('/k/v1/record/assignees.json')
        .reply(200, {'revision': '3'});

      const recordModule = new Record(conn);
      const updateRecordAssigneesResult = recordModule.updateRecordAssignees(data.app, data.appID, data.assignees, data.revision);
      expect(updateRecordAssigneesResult).toHaveProperty('then');
      expect(updateRecordAssigneesResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('valid data', () => {
      it('should update successfully the assignee of the record', () => {
        const data = {
          app: 1,
          id: 1,
          assignees: ['user1'],
          revision: 2
        };

        const expectResult = {'revision': '3'};

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/assignees.json', (rqBody) => {
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

        const recordModule = new Record(conn);
        const updateRecordAssigneesResult = recordModule.updateRecordAssignees(data.app, data.id, data.assignees, data.revision);
        return updateRecordAssigneesResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
      /**
       * Todo: implement another success case
       */
    });

    describe('error case', () => {
      describe('invalid id', () => {
        it('should return error when using unexist record id', () => {
          const data = {
            app: 1,
            id: 22,
            assignees: ['user1'],
            revision: 2
          };

          const expectResult = {'code': 'GAIA_RE01', 'id': '8PePOAQMHkWHWeynRPjQ', 'message': 'The specified record (ID: 22) is not found.'};

          nock('https://' + common.DOMAIN)
            .put('/k/v1/record/assignees.json', (rqBody) => {
              expect(rqBody).toMatchObject(data);
              return true;
            })
            .reply(404, expectResult);

          const recordModule = new Record(conn);
          const updateRecordAssigneesResult = recordModule.updateRecordAssignees(data.app, data.id, data.assignees, data.revision);
          return updateRecordAssigneesResult.catch((err) => {
            expect(err.get()).toMatchObject(expectResult);
          });
        });
      });
      /**
      * Todo: implement another error case
      */
    });
  });
});