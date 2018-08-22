
/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require('nock');

const common = require('../../common');

const KintoneAPIException = require('../../../src/exception/KintoneAPIException');
const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const Record = require('../../../src/module/record/Record');

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);
if (common.hasOwnProperty('proxy') && common.proxy) {
  conn.addRequestOption('proxy', common.proxy);
}

const recordModule = new Record(conn);
describe('common case', () => {
  it('should return a promise', () => {
    const appID = 1;
    const recordID = 1;
    nock('https://' + common.DOMAIN)
      .get(`/k/v1/record.json`)
      .reply(200, {
        'record': {}});

    const getRecordResult = recordModule.getRecord(appID, recordID);
    expect(getRecordResult).toHaveProperty('then');
    expect(getRecordResult).toHaveProperty('catch');
  });
});

describe('success case', () => {
  describe('valid params are specificed', () => {
    it('should have a "record" property in the result', () => {
      const appID = 1;
      const recordID = 1;
      nock('https://' + common.DOMAIN)
        .get(`/k/v1/record.json`, (rqBody, b) => {
          expect(rqBody.app).toBe(appID);
          expect(rqBody.id).toBe(recordID);
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
          'record': {}});
      return recordModule.getRecord(appID, recordID)
        .then((rsp) => {
          expect(rsp).toHaveProperty('record');
        });
    });
  });
  /**
  * Todo: implement another success case
  */
});

describe('error case', () => {
  describe('invalid appID param is specified', () => {
    it('"should return the error in the result', () => {
      const expectResult = {
        'code': 'CB_VA01',
        'id': 'PmcT6fVjQMsl4BhMw9Uo',
        'message': 'Missing or invalid input.',
        'errors': {'app': {'messages': ['must be greater than or equal to 1']}}
      };

      nock('https://' + common.DOMAIN)
        .get(`/k/v1/record.json`, (rqBody, b) => {
          expect(rqBody.app).toBe(-2);
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
        .reply(400, expectResult);
      const getRecordResult = recordModule.getRecord(-2);
      return getRecordResult.catch((err) => {
        expect(err).toBeInstanceOf(KintoneAPIException);
        expect(err.get()).toMatchObject(expectResult);
      });
    });
  });
  /**
  * Todo: implement another error case
  */
});
