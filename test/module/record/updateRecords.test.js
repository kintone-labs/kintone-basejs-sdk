
/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require('nock');

const common = require('../../utils/common');

const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const Record = require('../../../src/module/record/Record');

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

describe('updateRecords function', () => {
  describe('common case', () => {
    const appID = 1;
    const recordDataUpdate = {
      id: 1,
      record: {
        Text_0: 'test'
      },
      revision: 2
    };
    const recordsData = [recordDataUpdate];

    it('should return a promise', () => {
      nock('https://' + common.DOMAIN)
        .put('/k/v1/records.json')
        .reply(200, {
          'records': [{
            id: 1,
            revision: 3
          }]
        });

      const recordModule = new Record(conn);
      const updateRecordsResult = recordModule.updateRecords(appID, recordsData);
      expect(updateRecordsResult).toHaveProperty('then');
      expect(updateRecordsResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('valid data', () => {
      it('should update successfully the records', () => {
        const appID = 1;
        const recordDataUpdate = {
          id: 1,
          record: {
            Text_0: 'test'
          },
          revision: 2
        };
        const recordsData = [recordDataUpdate];
        const expectResult = {
          'records': [{
            id: 1,
            revision: 3
          }]
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/records.json', (rqBody) => {
            expect(rqBody.app).toEqual(appID);
            expect(rqBody.records).toMatchObject(recordsData);
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
        const updateRecordsResult = recordModule.updateRecords(appID, recordsData);
        return updateRecordsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('error case', () => {
      describe('wrong revision', () => {
        it('should return error when using wrong revison', () => {
          const appID = 1;
          const recordDataUpdate = {
            id: 1,
            record: {
              Text_0: 'test'
            },
            revision: 0
          };
          const recordsData = [recordDataUpdate];
          const expectResult = {
            'code': 'GAIA_CO02',
            'id': '4ucJiURAv0LsXBkLCDdi',
            'message': 'The revision is not the latest. Someone may update a record.'
          };
          nock('https://' + common.DOMAIN)
            .put('/k/v1/records.json', (rqBody) => {
              expect(rqBody.records).toMatchObject(recordsData);
              return true;
            })
            .reply(409, expectResult);
          const recordModule = new Record(conn);
          return recordModule.updateRecords(appID, recordsData).catch((err) => {
            expect(err.get()).toMatchObject(expectResult);
          });
        });
      });
      /**
      * Todo: implement another case error
      */
    });
  });
});