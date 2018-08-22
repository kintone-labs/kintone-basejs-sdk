
/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require('nock');

const config = require('../../config');
const common = require('../../common');

const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const Record = require('../../../src/module/record/Record');

const auth = new Auth();
auth.setPasswordAuth(config.username, config.password);

const conn = new Connection(config.domain, auth);

describe('updateRecordStatus function', () => {
  describe('common case', () => {
    const data = {
      app: 1,
      id: 1,
      action: 'Submit',
      assignee: 'user1',
      revision: 2
    };

    it('should return a promise', () => {
      nock('https://' + config.domain)
        .put('/k/v1/record/status.json')
        .reply(200, {'revision': '3'});

      const recordModule = new Record(conn);
      const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, data.appID, data.action, data.assignee, data.revision);
      expect(updateRecordStatusResult).toHaveProperty('then');
      expect(updateRecordStatusResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid data - Status and Assignee', () => {
      it('should changed successfully the status of the record', () => {
        const data = {
          app: 1,
          id: 1,
          action: 'Submit',
          assignee: 'user1',
          revision: 2
        };

        const expectResult = {'revision': '3'};

        nock('https://' + config.domain)
          .put('/k/v1/record/status.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
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

        const recordModule = new Record(conn);
        const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, data.id, data.action, data.assignee, data.revision);
        return updateRecordStatusResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
      /**
       * Todo: implement another success case
       */
    });

    describe('error case', () => {
      describe('Change status not assignee', () => {
        it('should return error when the login user is not assigned', () => {
          const data = {
            app: 1,
            id: 1,
            action: 'Submit',
            assignee: 'user1',
            revision: 2
          };

          const expectResult = {'code': 'GAIA_NT01', 'id': '4UPEpLZKYpZfju46I3wm', 'message': 'Only Assignee can change the status.'};

          nock('https://' + config.domain)
            .put('/k/v1/record/status.json', (rqBody) => {
              expect(rqBody).toMatchObject(data);
              return true;
            })
            .reply(403, expectResult);

          const recordModule = new Record(conn);
          const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, data.id, data.action, data.assignee, data.revision);
          return updateRecordStatusResult.catch((err) => {
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