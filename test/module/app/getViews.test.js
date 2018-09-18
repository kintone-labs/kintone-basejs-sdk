
/**
 * kintone api - nodejs client
 * test app module
 */
const nock = require('nock');

const common = require('../../../test/utils/common');


const {Connection, Auth, App, KintoneAPIException} = require(common.MAIN_PATH);

const URI = 'https://' + common.DOMAIN;

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

const appModule = new App(conn);

describe('getViews function', () => {
  describe('common function', () => {
    it('should return promise', () => {
      nock(URI)
        .get('/k/v1/app/views.json?app=1')
        .reply(200, {});

      const getViewsResult = appModule.getViews(1);
      expect(getViewsResult).toHaveProperty('then');
      expect(getViewsResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid request', () => {
      it('[View-3] should get successfully the app views information', () => {
        const data = {
          'app': 1,
          'lang': 'en'
        };
        const isPreview = true;

        const expectResult = {
          'views': {
            'View1': {
              'type': 'LIST',
              'name': 'View1',
              'id': '20733',
              'filterCond': 'Date_2 > LAST_WEEK()',
              'sort': 'Record_number asc',
              'index': '1',
              'fields': ['Record_number', 'Author']
            }
          }
        };
        nock(URI)
          .get(`/k/v1/preview/app/views.json?app=${data.app}&lang=${data.lang}`)
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .reply(200, expectResult);
        const getViewsResult = appModule.getViews(data.app, data.lang, isPreview);
        return getViewsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify the list of views of an live App without pre-live settings are returned', () => {
      it('[View-4] should get successfully the app views information', () => {
        const data = {
          'app': 1,
          'lang': 'en'
        };

        const expectResult = {
          'views': {
            'View1': {
              'type': 'LIST',
              'name': 'View1',
              'id': '20733',
              'filterCond': 'Date_2 > LAST_WEEK()',
              'sort': 'Record_number asc',
              'index': '1',
              'fields': ['Record_number', 'Author']
            }
          },
          'revision': '3'
        };
        nock(URI)
          .get(`/k/v1/app/views.json?app=${data.app}&lang=${data.lang}`)
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .reply(200, expectResult);
        const getViewsResult = appModule.getViews(data.app, data.lang);
        return getViewsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify the app views with a pre-live settings is returned when setting isPreview true', () => {
      it('[View-7] should get successfully the app views information', () => {
        const data = {
          'app': 1,
          'lang': 'en'
        };
        const isPreview = true;

        const expectResult = {
          'views': {
            'View1': {
              'type': 'LIST',
              'name': 'View1',
              'id': '20733',
              'filterCond': 'Date_2 > LAST_WEEK()',
              'sort': 'Record_number asc',
              'index': '1',
              'fields': ['Record_number', 'Author']
            }
          },
          'revision': '3'
        };
        nock(URI)
          .get(`/k/v1/preview/app/views.json?app=${data.app}&lang=${data.lang}`)
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .reply(200, expectResult);
        const getViewsResult = appModule.getViews(data.app, data.lang, isPreview);
        return getViewsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify the app views with a pre-live settings is not returned when setting isPreview false', () => {
      it('[View-8] should get successfully the app views information', () => {
        const data = {
          'app': 1,
          'lang': 'en'
        };
        const isPreview = false;

        const expectResult = {
          'views': {
            'View1': {
              'type': 'LIST',
              'name': 'View1',
              'id': '20733',
              'filterCond': 'Date_2 > LAST_WEEK()',
              'sort': 'Record_number asc',
              'index': '1',
              'fields': ['Record_number', 'Author']
            }
          },
          'revision': '3'
        };
        nock(URI)
          .get(`/k/v1/app/views.json?app=${data.app}&lang=${data.lang}`)
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .reply(200, expectResult);
        const getViewsResult = appModule.getViews(data.app, data.lang, isPreview);
        return getViewsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('The method still work correctly when executing with interger as string type', () => {
      it('[View-12] should get successfully the app views information', () => {
        const data = {
          'app': '1',
          'lang': 'en'
        };
        const isPreview = false;

        const expectResult = {
          'views': {
            'View1': {
              'type': 'LIST',
              'name': 'View1',
              'id': '20733',
              'filterCond': 'Date_2 > LAST_WEEK()',
              'sort': 'Record_number asc',
              'index': '1',
              'fields': ['Record_number', 'Author']
            }
          },
          'revision': '3'
        };
        nock(URI)
          .get(`/k/v1/app/views.json?app=${data.app}&lang=${data.lang}`)
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .reply(200, expectResult);
        const getViewsResult = appModule.getViews(data.app, data.lang, isPreview);
        return getViewsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('localized language', () => {
      it('[View-5] should get successfully the app views information', () => {
        const data = {
          'app': '1',
          'lang': 'ja'
        };
        const isPreview = false;

        const expectResult = {
          'views': {
            'My List View': {
              'type': 'CALENDAR',
              'name': '私のリストビュー',
              'id': '5520267',
              'filterCond': '',
              'sort': 'Record_number asc',
              'index': '0',
              'date': 'Updated_datetime',
              'title': 'Record_number'
            }
          },
          'revision': '3'
        };
        nock(URI)
          .get(`/k/v1/app/views.json?app=${data.app}&lang=${data.lang}`)
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .reply(200, expectResult);
        const getViewsResult = appModule.getViews(data.app, data.lang, isPreview);
        return getViewsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify using this method with guest space successfully', () => {
      it('[View-13] should get successfully the app views information', () => {
        const data = {
          'app': 1,
          'lang': 'en'
        };
        const isPreview = false;

        const expectResult = {
          'views': {
            'View1': {
              'type': 'LIST',
              'name': 'View1',
              'id': '20733',
              'filterCond': 'Date_2 > LAST_WEEK()',
              'sort': 'Record_number asc',
              'index': '1',
              'fields': ['Record_number', 'Author']
            }
          }
        };
        nock(URI)
          .get(`/k/guest/1/v1/app/views.json?app=${data.app}&lang=${data.lang}`)
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .reply(200, expectResult);
        const conn1 = new Connection(common.DOMAIN, auth, common.GUEST_SPACEID);
        const guestViewModule = new App(conn1);
        const getViewsResult = guestViewModule.getViews(data.app, data.lang, isPreview);
        return getViewsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
  });

  describe('error case', () => {
    describe('using API token authentication', () => {
      const authToken = new Auth();
      authToken.setApiToken('a2386gf84gd663a12s32s');
      const connUsingToken = new Connection(common.DOMAIN, authToken);
      const appUsingtOKEN = new App(connUsingToken);

      it('[View-2] should return error when using API token authentication ', () => {
        const data = {
          'app': 1,
          'lang': 'EN'
        };
        const expectResult = {
          'code': 'GAIA_NO01',
          'id': 'lzQPJ1hkW3Aj4iVebWCG',
          'message': 'Using this API token, you cannot run the specified API.'
        };
        nock(URI)
          .get(`/k/v1/app/views.json?app=${data.app}`)
          .reply(520, expectResult);
        const addFormFieldsResult = appUsingtOKEN.getViews(data.app);
        return addFormFieldsResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Invalid request', () => {
      it('[View-9] should return error when the appID is unexist', () => {
        const appID = '444444';
        const expectResult = {
          'code': 'GAIA_AP01',
          'id': 'K45k0CEPV5802MKyPcu1',
          'message': 'The app (ID: 444444) not found. The app may have been deleted.'
        };

        nock(URI)
          .get(`/k/v1/app/views.json?app=${appID}`)
          .reply(404, expectResult);
        const getViewsResult = appModule.getViews(appID);
        return getViewsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('The error will be displayed when using method without app ID', () => {
      it('[View-10] should return error in the result', () => {
        const data = {
          'lang': 'en'
        };
        const isPreview = false;
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'jtAmebldtGKc5ZR3RSx6',
          'message': 'Missing or invalid input.',
          'errors': {
            'app': {
              'messages': [
                'Required field.'
              ]
            }
          }
        };

        nock(URI)
          .get(`/k/v1/app/views.json?lang=${data.lang}`)
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .reply(400, expectResult);
        const getViewsResult = appModule.getViews(undefined, data.lang, isPreview);
        return getViewsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('The error will be displayed when input invalid language', () => {
      it('[View-11] should return error in the result', () => {
        const data = {
          'app': 1,
          'lang': 'error'
        };
        const isPreview = false;
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'EBwYU4Qof2OeUBzXMG9a',
          'message': 'Missing or invalid input.',
          'errors': {
            'lang': {
              'messages': [
                'must be one of the enum value'
              ]
            }
          }
        };

        nock(URI)
          .get(`/k/v1/app/views.json?app=${data.app}&lang=${data.lang}`)
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .reply(400, expectResult);
        const getViewsResult = appModule.getViews(data.app, data.lang, isPreview);
        return getViewsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
  });
});
