
/**
 * kintone api - nodejs client
 * test record module
 */

const KintoneExeption = require('../../../src/exception/KintoneAPIException');
const KintoneConnection = require('../../../src/connection/Connection');
const KintoneAuth = require('../../../src/authentication/Auth');
const KintoneRecord = require('../../../src/module/record/Record');
const nock = require('nock');
const config = require('../../config');

const auth = new KintoneAuth();
auth.setPasswordAuth(config.username, config.password);

const conn = new KintoneConnection(config.domain, auth);
if (config.hasOwnProperty('proxy') && config.proxy) {
  conn.addRequestOption('proxy', config.proxy);
}

const appID = 1;
const recordID = 1;

nock('https://' + config.domain)
  .get(`/k/v1/record.json`, (rqBody) => {
    return rqBody.app === appID && rqBody.id === recordID;
  })
  .matchHeader('X-Cybozu-Authorization', (authHeader) => {
    expect(authHeader).toBe(Buffer.from(config.username + ':' + config.password).toString('base64'));
    return true;
  })
  .matchHeader('Content-Type', (type) => {
    expect(type).toBe('application/json');
    return true;
  })
  .reply(200, {
    'record': {}});

const recordModule = new KintoneRecord(conn);
describe('common case', () => {

  const getRecordResult = recordModule.getRecord();
  it('should return a promise', () => {
    expect(getRecordResult).toHaveProperty('then');
    expect(getRecordResult).toHaveProperty('catch');
  });
});

describe('success case', () => {
  describe('valid params are specificed', () => {
    it('should have a "record" property in the result', () => {
      return recordModule.getRecord(appID, recordID)
        .then((rsp) => {
          expect(rsp).toHaveProperty('record');
        });
    });
    // todo
  });
  // todo
});

describe('error case', () => {
  describe('invalid appID param is specified', () => {
    const getRecordResult = recordModule.getRecord(2);
    it('"should return the error in the result', () => {
      return getRecordResult.catch((err) => {
        expect(err).toBeInstanceOf(KintoneExeption);
        expect(err.get()).toHaveProperty('id');
      });
    });
    // todo
  });
  // todo
});
