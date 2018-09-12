
/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require('nock');

const common = require('../../common');
const { KintoneException, Connection, Auth, Record } = require(common.MAIN_PATH);

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

const recordModule = new Record(conn);

describe('addRecords function', () => {
  describe('common case', () => {

    it('should return a promise', () => {
      nock('https://' + common.DOMAIN)
        .post('/k/v1/records.json')
        .reply(200, {
          'ids': ['1'],
          'revisions': ['1']
        });
      const addRecordsResult = recordModule.addRecords();
      expect(addRecordsResult).toHaveProperty('then');
      expect(addRecordsResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('valid data', () => {
      it('should add successfully the record', () => {
        const data = {
          appID: 1,
          recordsData: [{Text_0: {value: 1}}, {Text_0: {value: 2}}]
        };

        nock('https://' + common.DOMAIN)
          .post('/k/v1/records.json', (rqBody) => {
            expect(rqBody.records).toEqual(expect.arrayContaining(data.recordsData));
            return rqBody.app === data.appID;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, {
            'ids': ['1', '2'],
            'revisions': ['1', '1']
          });

        const addRecordsResult = recordModule.addRecords(data.appID, data.recordsData);
        return addRecordsResult.then((rsp) => {
          expect(rsp).toHaveProperty('ids');
          expect(rsp.revisions).toEqual(expect.arrayContaining(['1', '1']));
        });
      });
    });
    /**
    * Todo: implement another success case
    */
  });

  describe('error', () => {
    describe('invalid app ID', () => {
      it('should return an error when using unexisted appID', () => {
        const data = {
          unexistedAppID: 999,
          recordsData: [{Text_0: {value: 1}}, {Text_0: {value: 2}}]
        };
        nock('https://' + common.DOMAIN)
          .post('/k/v1/records.json', (rqBody) => {
            expect(rqBody.app).toEqual(data.unexistedAppID);
            return true;
          })
          .reply(404, {'code': 'GAIA_AP01', 'id': 'Jt2jVNMHlZxXPufVeZCz', 'message': 'The app (ID: 999) not found. The app may have been deleted.'});

        const addRecordsResult = recordModule.addRecords(data.unexistedAppID, data.recordsData);
        return addRecordsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
        });
      });

      it('should return error when using negative appID', () => {
        const data = {
          negativeAppID: 999,
          recordsData: [{Text_0: {value: 1}}, {Text_0: {value: 2}}]
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'PmcT6fVjQMsl4BhMw9Uo',
          'message': 'Missing or invalid input.',
          'errors': {'app': {'messages': ['must be greater than or equal to 1']}}
        };
        nock('https://' + common.DOMAIN)
          .post('/k/v1/records.json', (rqBody) => {
            expect(rqBody.app).toEqual(data.negativeAppID);
            return true;
          })
          .reply(400, expectResult);

        const addRecordsResult = recordModule.addRecords(data.negativeAppID, data.recordsData);
        return addRecordsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });

      it('should return error when appID is 0', () => {
        const data = {
          appID: 0,
          recordsData: [{Text_0: {value: 1}}, {Text_0: {value: 2}}]
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'PmcT6fVjQMsl4BhMw9Uo',
          'message': 'Missing or invalid input.',
          'errors': {'app': {'messages': ['must be greater than or equal to 1']}}
        };
        nock('https://' + common.DOMAIN)
          .post('/k/v1/records.json', (rqBody) => {
            expect(rqBody.app).toEqual(0);
            return true;
          })
          .reply(400, expectResult);

        const addRecordsResult = recordModule.addRecords(data.appID, data.recordsData);
        return addRecordsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });

    });
    /**
    * Todo: implement another error case
    */
  });
});
