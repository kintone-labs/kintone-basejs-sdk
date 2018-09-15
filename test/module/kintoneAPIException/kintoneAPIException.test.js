const requestPromise = require('request-promise');
const nock = require('nock');

const common = require('../../utils/common');
const KintoneAPIException = require('../../../src/exception/KintoneAPIException');

const expectResult = {
  'code': 'CB_VA01',
  'id': 'PmcT6fVjQMsl4BhMw9Uo',
  'message': 'Missing or invalid input.',
  'errors': {'app': {'messages': ['must be greater than or equal to 1']}}
};

nock('https://' + common.DOMAIN)
  .get(`/k/v1/records.json`)
  .reply(400, expectResult);

const request = requestPromise({
  uri: 'https://' + common.DOMAIN + '/k/v1/records.json',
  method: 'GET',
  headers: {
    [common.PASSWORD_AUTH]: common.getPasswordAuth(common.USERNAME, common.PASSWORD),
    'Content-Type': 'application/json'
  },
  body: {
    app: -2
  },
  json: true
}).catch((err) => {
  throw new KintoneAPIException(err);
});
describe('kintoneAPIException module', () => {
  describe('get function', () => {
    it('should return kintone error response', () => {
      return request.catch(err => {
        expect(err.get()).toMatchObject(expectResult);
      });
    });
  });

  describe('getAll function', () => {
    it('should return Promise.reject', () => {
      return request.catch(err => {
        expect(err.getAll()).toHaveProperty('response');
      });
    });
  });
});