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

const recordModule = new Record(conn);
describe('getRecords function', () => {
  describe('common case', () => {
    it('should return a promise', () => {
      nock('https://' + common.DOMAIN)
        .get(`/k/v1/records.json`)
        .reply(200, {records: []});
      const getRecordsResult = recordModule.getRecords();
      expect(getRecordsResult).toHaveProperty('then');
      expect(getRecordsResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('valid params are specificed', () => {
      it('should have a "records" property in the result', () => {
        const body = {
          app: 844,
          query: 'Created_datetime = TODAY()',
          fields: ['Created_datetime', '$id', 'dropdown', 'radio', 'checkbox'],
          totalCount: false
        };

        nock('https://' + common.DOMAIN)
          .get(`/k/v1/records.json`, (rqbody) => {
            expect(rqbody).toMatchObject(body);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(Buffer.from(common.USERNAME + ':' + common.PASSWORD).toString('base64'));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, {
            'records': [{}]});
        return recordModule.getRecords(body.app, body.query, body.fields, body.totalCount)
          .then(rsp => {
            expect(rsp).toHaveProperty('records');
          });
      });
    });
    /**
    * Todo: implement another success case
    */
  });

  describe('error case', () => {
    describe('the app ID param is invalid', () => {
      it('should return the error in the result', () => {
        const body = {
          app: -2,
          query: 'Created_datetime = TODAY()',
          fields: ['Created_datetime', '$id', 'dropdown', 'radio', 'checkbox'],
          totalCount: false
        };

        const expectResult = {
          'code': 'CB_VA01',
          'id': 'PmcT6fVjQMsl4BhMw9Uo',
          'message': 'Missing or invalid input.',
          'errors': {'app': {'messages': ['must be greater than or equal to 1']}}
        };
        nock('https://' + common.DOMAIN)
          .get(`/k/v1/records.json`, (rqbody) => {
            expect(rqbody).toMatchObject(body);
            return true;
          })
          .reply(200, expectResult);

        const getRecordsResult = recordModule.getRecords(-2, body.query, body.fields, body.totalCount);
        return getRecordsResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
  /**
  * Todo: implement another error case
  */
  });
});

