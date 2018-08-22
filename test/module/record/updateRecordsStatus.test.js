
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

describe('updateRecordsStatus function', () => {
  describe('common case', () => {
    const data = {
      app: 1,
      records: [{
        id: 1,
        action: 'Submit',
        assignee: 'user1',
        revision: 2
      }]
    };

    it('should return a promise', () => {
      nock('https://' + config.domain)
        .put('/k/v1/records/status.json')
        .reply(200, {'revision': '3'});

      const recordModule = new Record(conn);
      const updateRecordsStatusResult = recordModule.updateRecordsStatus(data.app, data.records);
      expect(updateRecordsStatusResult).toHaveProperty('then');
      expect(updateRecordsStatusResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid data', () => {
      it('should changed successfully the status of the multiple record', () => {
        const data = {
          app: 1,
          records: [{
            id: 1,
            action: 'Submit',
            assignee: 'user1',
            revision: 2
          },
          {
            id: 2,
            action: 'Approve',
            assignee: 'user1',
            revision: 1
          }]
        };

        const expectResult = {
          'records': [{
            'id': '1',
            'revision': '3'
          },
          {
            'id': '2',
            'revision': '2'
          }]
        };

        nock('https://' + config.domain)
          .put('/k/v1/records/status.json', (rqBody) => {
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
        const updateRecordsStatusResult = recordModule.updateRecordsStatus(data.app, data.records);
        return updateRecordsStatusResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
      /**
       * Todo: implement another success case
       */
    });

    describe('error case', () => {
      describe('Invalid data', () => {
        it('should return error when the action name is blank', () => {
          const data = {
            app: 1,
            records: [{
              id: 1,
              action: '',
              assignee: 'user1',
              revision: 2
            }]
          };

          const expectResult = {'code': 'CB_VA01',
            'id': 'IARR1iA2jOY5dMzRzVys',
            'message': 'Missing or invalid input.',
            'errors': {'records[0].action': {'messages': ['Required field.']}
            }};

          nock('https://' + config.domain)
            .put('/k/v1/records/status.json', (rqBody) => {
              expect(rqBody).toMatchObject(data);
              return true;
            })
            .reply(400, expectResult);

          const recordModule = new Record(conn);
          const updateRecordsStatusResult = recordModule.updateRecordsStatus(data.app, data.records);
          return updateRecordsStatusResult.catch((err) => {
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