
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

describe('updateViews function', () => {
  describe('common function', () => {
    it('should return promise', () => {
      nock(URI)
        .put('/k/v1/preview/app/views.json')
        .reply(200, {});

      const updateViewsResult = appModule.updateViews();
      expect(updateViewsResult).toHaveProperty('then');
      expect(updateViewsResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid request', () => {
      it('[View-17] should update successfully the app views', () => {
        const data = {
          'app': 1,
          'views': {
            'My List View': {
              'index': 0,
              'type': 'LIST',
              'name': 'My List View',
              'fields': [
                'Record_number',
                'Text_single_line'
              ],
              'filterCond': 'Updated_datetime > LAST_WEEK()',
              'sort': 'Record_number asc'
            }
          }
        };

        const expectResult = {
          'views': {
            'My List View': {
              'id': '5520254'
            }
          },
          'revision': '2'
        };
        nock(URI)
          .put('/k/v1/preview/app/views.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toEqual(expect.stringContaining('application/json'));
            return true;
          })
          .reply(200, expectResult);
        const updateViewsResult = appModule.updateViews(data.app, data.views);
        return updateViewsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Valid request - Revision -1', () => {
      it('[View-29] should update successfully the app views', () => {
        const data = {
          'app': 1,
          'views': {
            'My List View': {
              'index': 0,
              'type': 'LIST',
              'name': 'My List View',
              'fields': [
                'Record_number',
                'Text_single_line'
              ],
              'filterCond': 'Updated_datetime > LAST_WEEK()',
              'sort': 'Record_number asc'
            }
          },
          revision: -1
        };

        const expectResult = {
          'views': {
            'My List View': {
              'id': '5520254'
            }
          },
          'revision': '2'
        };
        nock(URI)
          .put('/k/v1/preview/app/views.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toEqual(expect.stringContaining('application/json'));
            return true;
          })
          .reply(200, expectResult);
        const updateViewsResult = appModule.updateViews(data.app, data.views, data.revision);
        return updateViewsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('The method still work correctly when executing with interger as string type', () => {
      it('[View-18] should update successfully the app views', () => {
        const data = {
          'app': '1',
          'views': {
            'My List View': {
              'index': 0,
              'type': 'LIST',
              'name': 'My List View',
              'fields': [
                'Record_number',
                'Text_single_line'
              ],
              'filterCond': 'Updated_datetime > LAST_WEEK()',
              'sort': 'Record_number asc'
            }
          },
          revision: -1
        };

        const expectResult = {
          'views': {
            'My List View': {
              'id': '5520254'
            }
          },
          'revision': '2'
        };
        nock(URI)
          .put('/k/v1/preview/app/views.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toEqual(expect.stringContaining('application/json'));
            return true;
          })
          .reply(200, expectResult);
        const updateViewsResult = appModule.updateViews(data.app, data.views, data.revision);
        return updateViewsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify using this method with guest space successfully', () => {
      it('[View-19] should update successfully the app views', () => {
        const data = {
          'app': '1',
          'views': {
            'My List View': {
              'index': 0,
              'type': 'LIST',
              'name': 'My List View',
              'fields': [
                'Record_number',
                'Text_single_line'
              ],
              'filterCond': 'Updated_datetime > LAST_WEEK()',
              'sort': 'Record_number asc'
            }
          },
          revision: -1
        };

        const expectResult = {
          'views': {
            'My List View': {
              'id': '5520254'
            }
          },
          'revision': '2'
        };
        nock(URI)
          .put('/k/guest/1/v1/preview/app/views.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toEqual(expect.stringContaining('application/json'));
            return true;
          })
          .reply(200, expectResult);
        const conn1 = new Connection(common.DOMAIN, auth, common.GUEST_SPACEID);
        const guestViewModule = new App(conn1);
        const updateViewsResult = guestViewModule.updateViews(data.app, data.views, data.revision);
        return updateViewsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
  });

  describe('error case', () => {
    describe('API Token Authentication', () => {
      it('[View-16] Error happens when running the command with API token', () => {
        const authToken = new Auth();
        authToken.setApiToken('a2386gf84gd663a12s32s');
        const connUsingToken = new Connection(common.DOMAIN, authToken);
        const appUsingtOKEN = new App(connUsingToken);
        const appID = 1;
        const expectResult = {
          'code': 'GAIA_NO01',
          'id': 'lzQPJ1hkW3Aj4iVebWCG',
          'message': 'Using this API token, you cannot run the specified API.'
        };

        nock(URI)
          .put('/k/v1/preview/app/views.json', (rqBody) => {
            expect(rqBody.app).toEqual(appID);
            return true;
          })
          .reply(520, expectResult);
        const updateViewsResult = appUsingtOKEN.updateViews(appID);
        return updateViewsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Invalid request', () => {
      it('[View-25] should return error when the appID is unexist', () => {
        const appID = '444444';
        const expectResult = {
          'code': 'GAIA_AP01',
          'id': 'K45k0CEPV5802MKyPcu1',
          'message': 'The app (ID: 444444) not found. The app may have been deleted.'
        };

        nock(URI)
          .put('/k/v1/preview/app/views.json', (rqBody) => {
            expect(rqBody.app).toEqual(appID);
            return true;
          })
          .reply(404, expectResult);
        const updateViewsResult = appModule.updateViews(appID);
        return updateViewsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('The error will be displayed when using method without app ID', () => {
      it('[View-20] should return error when using method without app ID', () => {
        const data = {
          'views': {
            'My List View': {
              'index': 0,
              'type': 'LIST',
              'name': 'My List View',
              'fields': [
                'Record_number',
                'Text_single_line'
              ],
              'filterCond': 'Updated_datetime > LAST_WEEK()',
              'sort': 'Record_number asc'
            }
          },
          revision: -1
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'SymrRydtYovWQRSM2YVo',
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
          .put('/k/v1/preview/app/views.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toEqual(expect.stringContaining('application/json'));
            return true;
          })
          .reply(400, expectResult);
        const updateViewsResult = appModule.updateViews(undefined, data.views, data.revision);
        return updateViewsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('The error will be displayed when using without views', () => {
      it('[View-21] should return error when using without views', () => {
        const data = {
          'app': 1,
          revision: -1
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': '3X2AtZvR92GpXdN4bRSC',
          'message': 'Missing or invalid input.',
          'errors': {
            'views': {
              'messages': [
                'Required field.'
              ]
            }
          }
        };

        nock(URI)
          .put('/k/v1/preview/app/views.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toEqual(expect.stringContaining('application/json'));
            return true;
          })
          .reply(400, expectResult);
        const updateViewsResult = appModule.updateViews(data.app, undefined, data.revision);
        return updateViewsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('The error will be displayed when using without views index', () => {
      it('[View-22] should return error when using without views index', () => {
        const data = {
          'app': 1,
          'views': {
            'My List View': {
              'type': 'LIST',
              'name': 'My List View',
              'fields': [
                'Record_number',
                'Text_single_line'
              ],
              'filterCond': 'Updated_datetime > LAST_WEEK()',
              'sort': 'Record_number asc'
            }
          },
          revision: -1
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'qkKkSv7NxmiZousHNFWP',
          'message': 'Missing or invalid input.',
          'errors': {
            'views[My List View].index': {
              'messages': [
                'Required field.'
              ]
            }
          }
        };

        nock(URI)
          .put('/k/v1/preview/app/views.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toEqual(expect.stringContaining('application/json'));
            return true;
          })
          .reply(400, expectResult);
        const updateViewsResult = appModule.updateViews(data.app, data.views, data.revision);
        return updateViewsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('The error will be displayed when using without views type', () => {
      it('[View-23] should return error when using without views type', () => {
        const data = {
          'app': 1,
          'views': {
            'My List View': {
              'index': 0,
              'name': 'My List View',
              'fields': [
                'Record_number',
                'Text_single_line'
              ],
              'filterCond': 'Updated_datetime > LAST_WEEK()',
              'sort': 'Record_number asc'
            }
          },
          revision: -1
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'modRH1Jbwil0FVG9apjA',
          'message': 'Missing or invalid input.',
          'errors': {
            'views[My List View].type': {
              'messages': [
                'Required field.'
              ]
            }
          }
        };

        nock(URI)
          .put('/k/v1/preview/app/views.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toEqual(expect.stringContaining('application/json'));
            return true;
          })
          .reply(400, expectResult);
        const updateViewsResult = appModule.updateViews(data.app, data.views, data.revision);
        return updateViewsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('The error will be displayed when input view name unexisted', () => {
      it('[View-24] should return error when input view name unexisted', () => {
        const data = {
          'app': 1,
          'views': {
            'Unexist_View': {
              'index': 0,
              'type': 'LIST',
              'name': 'My List View',
              'fields': [
                'Record_number',
                'Text_single_line'
              ],
              'filterCond': 'Updated_datetime > LAST_WEEK()',
              'sort': 'Record_number asc'
            }
          },
          revision: -1
        };
        const expectResult = {
          'code': 'GAIA_IN01',
          'id': '6J4fimXOSy52ktvtQ4aB',
          'message': 'Failed to update view. Key Unexist_View does not match the value of My List View in the name parameter.'
        };

        nock(URI)
          .put('/k/v1/preview/app/views.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toEqual(expect.stringContaining('application/json'));
            return true;
          })
          .reply(400, expectResult);
        const updateViewsResult = appModule.updateViews(data.app, data.views, data.revision);
        return updateViewsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error is displayed when input invalid revision', () => {
      it('[View-26] should return error when input invalid revision', () => {
        const data = {
          'app': 1,
          'views': {
            'My List View': {
              'index': 0,
              'type': 'LIST',
              'name': 'My List View',
              'fields': [
                'Record_number',
                'Text_single_line'
              ],
              'filterCond': 'Updated_datetime > LAST_WEEK()',
              'sort': 'Record_number asc'
            }
          },
          revision: 'abc'
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'wUGDGKjFJt1EsdUyU2Zl',
          'message': 'Missing or invalid input.',
          'errors': {
            'revision': {
              'messages': [
                'Enter an integer value.'
              ]
            }
          }
        };

        nock(URI)
          .put('/k/v1/preview/app/views.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toEqual(expect.stringContaining('application/json'));
            return true;
          })
          .reply(400, expectResult);
        const updateViewsResult = appModule.updateViews(data.app, data.views, data.revision);
        return updateViewsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('The error will be displayed when using invalid View type', () => {
      it('[View-27] should return error when input invalid revision', () => {
        const data = {
          'app': 1,
          'views': {
            'My List View': {
              'index': 0,
              'type': 'ERROR',
              'name': 'My List View',
              'fields': [
                'Record_number',
                'Text_single_line'
              ],
              'filterCond': 'Updated_datetime > LAST_WEEK()',
              'sort': 'Record_number asc'
            }
          },
          revision: -1
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'WMVdR2fQXDkANG7fTn5A',
          'message': 'Missing or invalid input.',
          'errors': {
            'views[My List View].type': {
              'messages': [
                'must be one of the enum value'
              ]
            }
          }
        };

        nock(URI)
          .put('/k/v1/preview/app/views.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toEqual(expect.stringContaining('application/json'));
            return true;
          })
          .reply(400, expectResult);
        const updateViewsResult = appModule.updateViews(data.app, data.views, data.revision);
        return updateViewsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('The error will be displayed when using invalid View index', () => {
      it('[View-28] should return error when input invalid revision', () => {
        const data = {
          'app': 1,
          'views': {
            'My List View': {
              'index': 'abc',
              'type': 'CALENDAR',
              'name': 'My List View',
              'fields': [
                'Record_number',
                'Text_single_line'
              ],
              'filterCond': 'Updated_datetime > LAST_WEEK()',
              'sort': 'Record_number asc'
            }
          },
          revision: -1
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'fRU7IE78RnIXPCMCsVix',
          'message': 'Missing or invalid input.',
          'errors': {
            'views[My List View].index': {
              'messages': [
                'Enter an integer value.'
              ]
            }
          }
        };

        nock(URI)
          .put('/k/v1/preview/app/views.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toEqual(expect.stringContaining('application/json'));
            return true;
          })
          .reply(400, expectResult);
        const updateViewsResult = appModule.updateViews(data.app, data.views, data.revision);
        return updateViewsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
  });
});
