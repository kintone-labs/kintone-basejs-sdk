
/**
 *  kintone api - nodejs client
 * test record module
 */
const nock = require('nock');
const common = require('../../../test/utils/common');
const {KintoneAPIException, Connection, Auth, Record} = require(common.MAIN_PATH);

const auth = new Auth().setPasswordAuth(common.USERNAME, common.PASSWORD);
const conn = new Connection(common.DOMAIN, auth);
const recordModule = new Record(conn);


describe('deleteRecords function', () => {
  describe('common case', () => {
    it('should return a promise', () => {
      const data = {
        app: 2,
        ids: [1]
      };
      nock('https://' + common.DOMAIN)
        .intercept('/k/v1/records.json', 'DELETE')
        .reply(200, {});
      const deleteRecordsResult = recordModule.deleteRecords(data.app, data.ids);
      expect(deleteRecordsResult).toHaveProperty('then');
      expect(deleteRecordsResult).toHaveProperty('catch');
    });
  });

  describe('Single delete', () => {
    it('[Record-127] delete successfully the record when specifying only 1 id', () => {
      const data = {
        app: 2,
        ids: [1]
      };
      nock('https://' + common.DOMAIN)
        .intercept('/k/v1/records.json', 'DELETE', (rqBody) => {
          expect(rqBody.app).toEqual(data.app);
          expect(rqBody.ids).toEqual(data.ids);
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
        .reply(200, {});

      const deleteRecordsResult = recordModule.deleteRecords(data.app, data.ids);
      return deleteRecordsResult.then((rsp) => {
        expect(rsp).toEqual({});
      });
    });
    /**
    * Todo: implement more case
    */
    describe('multiple delete', () => {
      it('[Record-128] delete when specifying array of multiple ids', () => {
        const data = {
          app: 2,
          ids: [1, 3, 2, 4, 5]
        };
        nock('https://' + common.DOMAIN)
          .intercept('/k/v1/records.json', 'DELETE', (rqBody) => {
            expect(rqBody.app).toEqual(data.app);
            expect(rqBody.ids).toEqual(data.ids);
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
          .reply(200, {});

        const deleteRecordsResult = recordModule.deleteRecords(data.app, data.ids);
        return deleteRecordsResult.then((rsp) => {
          expect(rsp).toEqual({});
        });
      });
    });

  });

  describe('Invalid record id', () => {
    it('[Record-129] error when the record id is not exsist', () => {
      const data = {
        app: 2,
        ids: [1000]
      };
      nock('https://' + common.DOMAIN)
        .intercept('/k/v1/records.json', 'DELETE', (rqBody) => {
          expect(rqBody.app).toEqual(data.app);
          expect(rqBody.ids).toEqual(data.ids);
          return true;
        })
        .reply(404, {'code': 'GAIA_RE01', 'id': 'oXd3Yf2UTlJO7aoDATQT', 'message': '指定したレコード（id: 100000）が見つかりません。'});

      const deleteRecordsResult = recordModule.deleteRecords(data.app, data.ids);
      return deleteRecordsResult.catch((err) => {
        expect(err).toBeInstanceOf(KintoneAPIException);
      });
    });
    /**
    * Todo: implement another error case
    */
    describe('does not have Delete permission', () => {
      it('[Record-130] error happens when user does not have Delete permission for app ', () => {
        const data = {
          app: 2,
          ids: [1]
        };
        nock('https://' + common.DOMAIN)
          .intercept('/k/v1/records.json', 'DELETE', (rqBody) => {
            expect(rqBody.app).toEqual(data.app);
            expect(rqBody.ids).toEqual(data.ids);
            return true;
          })
          .reply(403, {'code': 'CB_NO02', 'id': 'DbTLTAJWHM70iV7jmpaW', 'message': 'No privilege to proceed.'});

        const deleteRecordsResult = recordModule.deleteRecords(data.app, data.ids);
        return deleteRecordsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
        });
      });
    });

    describe('Having Delete permission', () => {
      it('[Record-131] Able to delete when user have View/Delete permission for app but does not have Edit permission ', () => {
        const data = {
          app: 2,
          ids: [1]
        };
        nock('https://' + common.DOMAIN)
          .intercept('/k/v1/records.json', 'DELETE', (rqBody) => {
            expect(rqBody.app).toEqual(data.app);
            expect(rqBody.ids).toEqual(data.ids);
            return true;
          })
          .reply(200, {});

        const deleteRecordsResult = recordModule.deleteRecords(data.app, data.ids);
        return deleteRecordsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
        });
      });
    });

    describe('having Delete permission', () => {
      it('[Record-132] Able to delete when user have View/Delete permission for record but does not have Edit permission ', () => {
        const data = {
          app: 2,
          ids: [1]
        };
        nock('https://' + common.DOMAIN)
          .intercept('/k/v1/records.json', 'DELETE', (rqBody) => {
            expect(rqBody.app).toEqual(data.app);
            expect(rqBody.ids).toEqual(data.ids);
            return true;
          })
          .reply(200, {});

        const deleteRecordsResult = recordModule.deleteRecords(data.app, data.ids);
        return deleteRecordsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
        });
      });
    });

    describe('invalid app ID', () => {
      it('[Record-133] Error will be displayed when using invalid app ID ', () => {
        const data = {
          app: -2,
          ids: [1]
        };
        nock('https://' + common.DOMAIN)
          .intercept('/k/v1/records.json', 'DELETE', (rqBody) => {
            expect(rqBody.app).toEqual(data.app);
            expect(rqBody.ids).toEqual(data.ids);
            return true;
          })
          .reply(404, {'code': 'CB_VA01', 'id': '84Xn1q5RFbwN40k7K3ej', 'message': '入力内容が正しくありません。'});

        const deleteRecordsResult = recordModule.deleteRecords(data.app, data.ids);
        return deleteRecordsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
        });
      });
    });

    describe('Missing required field (app)', () => {
      it('[Record-134] Error will be displayed when using method without app ID ', () => {
        const data = {
          ids: [1]
        };
        nock('https://' + common.DOMAIN)
          .intercept('/k/v1/records.json', 'DELETE', (rqBody) => {
            expect(rqBody.ids).toEqual(data.ids);
            return true;
          })
          .reply(404, {'code': 'CB_IJ01', 'id': '84Xn1q5RFbwN40k7K3ej', 'message': '不正なJSON文字列です。'});

        const deleteRecordsResult = recordModule.deleteRecords(data.app, data.ids);
        return deleteRecordsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
        });
      });
    });

    describe('Missing required field (ids)', () => {
      it('[Record-135] Error will be displayed when using method without ids ', () => {
        const data = {
          app: 1
        };
        nock('https://' + common.DOMAIN)
          .intercept('/k/v1/records.json', 'DELETE', (rqBody) => {
            expect(rqBody.app).toEqual(data.app);
            return true;
          })
          .reply(404, {'code': 'CB_VA01', 'id': '84Xn1q5RFbwN40k7K3ej', 'message': '入力内容が正しくありません。'});

        const deleteRecordsResult = recordModule.deleteRecords(data.app, data.ids);
        return deleteRecordsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
        });
      });
    });

    describe('deleted Record successfully for app in guest space', () => {
      it('[Record-136] deleted Record successfully for app in guest space ', () => {
        const data = {
          app: 1,
          ids: [2]
        };

        const conn_Guest_Space = new Connection(common.DOMAIN, auth, common.GUEST_SPACEID);
        const recordModule_Guest_Space = new Record(conn_Guest_Space);
        nock('https://' + common.DOMAIN)
          .intercept('/k/guest/{common.GUEST_SPACEID}/v1/records.json', 'DELETE', (rqBody) => {
            expect(rqBody.app).toEqual(data.app);
            expect(rqBody.ids).toEqual(data.ids);
            return true;
          })
          .reply(200, {});

        const deleteRecordsResult = recordModule_Guest_Space.deleteRecords(data.app, data.ids);
        return deleteRecordsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
        });
      });
    });

    describe('Invalid input type for app', () => {
      it('[Record-137] Error returns when executing with wrong type of parameter for app', () => {
        const data = {
          app: -1,
          ids: [2]
        };

        nock('https://' + common.DOMAIN)
          .intercept('/k/v1/records.json', 'DELETE', (rqBody) => {
            expect(rqBody.app).toEqual(data.app);
            expect(rqBody.ids).toEqual(data.ids);
            return true;
          })
          .reply(400, {'code': 'CB_IJ01', 'id': 'fI40R4N5Kg6XFzDppGIf', 'message': 'Invalid JSON string.'});

        const deleteRecordsResult = recordModule.deleteRecords(data.app, data.ids);
        return deleteRecordsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
        });
      });
    });

    describe('can be deleted at once is 100', () => {
      it('[Record-138] Can be deleted at once is 100', () => {
        const data = {
          app: 1,
          ids: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
            30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
            57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
            84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100
          ]
        };

        nock('https://' + common.DOMAIN)
          .intercept('/k/v1/records.json', 'DELETE', (rqBody) => {
            expect(rqBody.app).toEqual(data.app);
            expect(rqBody.ids).toEqual(data.ids);
            return true;
          })
          .reply(200, {});

        const deleteRecordsResult = recordModule.deleteRecords(data.app, data.ids);
        return deleteRecordsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
        });
      });
    });

    describe('error displays when number of records is > 100', () => {
      it('[Record-139] Error displays when number of records is > 100', () => {
        const data = {
          app: 1,
          ids: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
            30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
            57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
            84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103
          ]
        };

        nock('https://' + common.DOMAIN)
          .intercept('/k/v1/records.json', 'DELETE', (rqBody) => {
            expect(rqBody.app).toEqual(data.app);
            expect(rqBody.ids).toEqual(data.ids);
            return true;
          })
          .reply(400, {'code': 'CB_VA01', 'id': 'fI40R4N5Kg6XFzDppGIf', 'message': '入力内容が正しくありません。'});

        const deleteRecordsResult = recordModule.deleteRecords(data.app, data.ids);
        return deleteRecordsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
        });
      });
    });

  });
});
