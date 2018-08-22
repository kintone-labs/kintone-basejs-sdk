/**
 * kintone api - nodejs client
 * test record module
 */

const KintoneExeption = require('../../../src/exception/KintoneAPIException');
const KintoneConnection = require('../../../src/connection/Connection');
const KintoneAuth = require('../../../src/authentication/Auth');
const KintoneRecord = require('../../../src/module/record/Record');
const nock = require('../../../../../../../../Library/Caches/typescript/2.9/node_modules/@types/nock');
const config = require('../../config');

const auth = new KintoneAuth();
auth.setPasswordAuth(config.username, config.password);

const conn = new KintoneConnection(config.domain, auth);
if (config.hasOwnProperty('proxy') && config.proxy) {
  conn.addRequestOption('proxy', config.proxy);
}

const body = {
  app: 844,
  query: 'Created_datetime = TODAY()',
  fields: ['Created_datetime', '$id', 'dropdown', 'radio', 'checkbox'],
  totalCount: false
};

nock('https://' + config.domain)
  .get(`/k/v1/records.json`, (rqbody) => {
    if (rqbody.hasOwnProperty('totalCount')) {
      expect(typeof (rqbody.totalCount)).toBe('boolean');
    }

    if (rqbody.hasOwnProperty('query')) {
      const unExistFields = rqbody.fields.filter(field => body.fields.indexOf(field) === -1);
      expect(unExistFields.length).toBe(0);
    }

    if (rqbody.hasOwnProperty('fields')) {
      expect(Array.isArray(rqbody.fields)).toBe(true);

      const unExistFields = rqbody.fields.filter(field => body.fields.indexOf(field) === -1);
      expect(unExistFields.length).toBe(0);
    }

    return rqbody.app === body.app;
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
    'records': [{}]});

const recordModule = new KintoneRecord(conn);
describe('getRecords function', () => {
  describe('common case', () => {
    const getRecordsResult = recordModule.getRecords();
    it('should return a promise', () => {
      expect(getRecordsResult).toHaveProperty('then');
      expect(getRecordsResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('valid params are specificed', () => {
      it('should have a "records" property in the result', () => {
        return recordModule.getRecords(body.app, body.query, body.fields, body.totalCount)
          .then(rsp => {
            expect(rsp).toHaveProperty('records');
          });
      });
    // todo
    });
  // todo
  });

  describe('error case', () => {
    describe('the app ID param is invalid', () => {
      const getRecordsResult = recordModule.getRecords(34, body.query, body.fields, body.totalCount);
      it('should return the error in the result', () => {
        return getRecordsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneExeption);
        });
      });
    // todo
    });
  // todo
  });
});

