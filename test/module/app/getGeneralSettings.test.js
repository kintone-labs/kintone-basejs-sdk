/**
 * kintone api - nodejs client
 * test app module
 */
const nock = require('nock');
const common = require('../utils/common');
const {App, Auth, Connection, KintoneAPIException} = require('../../../src/main.js');

const URI = 'https://' + common.DOMAIN;
const preLiveRoute = '/k/v1/preview/app/settings.json';
const liveRoute = '/k/v1/app/settings.json';
const guest_PreLiveRoute = `/k/guest/${common.GUEST_SPACEID}/v1/preview/app/settings.json`;
const guest_LiveRoute = `/k/guest/${common.GUEST_SPACEID}/v1/app/settings.json`;

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);
const conn = new Connection(common.DOMAIN, auth);
const appModule = new App(conn);

const auth_API = new Auth();
auth_API.setApiToken('testAPIToken');
const conn_API = new Connection(common.DOMAIN, auth_API);
const conn_API_Guest_Space = new Connection(common.DOMAIN, auth_API, common.GUEST_SPACEID);
const appModule_API = new App(conn_API);
const appModule_API_Guest_Space = new App(conn_API_Guest_Space);

const conn_Guest_Space = new Connection(common.DOMAIN, auth, common.GUEST_SPACEID);
const appModule_Guest_Space = new App(conn_Guest_Space);

describe('getGeneralSettings function', () => {
  describe('common function', () => {
    it('should return promise', () => {
      nock(URI)
        .get(liveRoute)
        .reply(200, {});
      const getGeneralSettingsResult = appModule.getGeneralSettings();
      expect(getGeneralSettingsResult).toHaveProperty('then');
      expect(getGeneralSettingsResult).toHaveProperty('catch');
    });
    it('should return promise PRE-LIVE', () => {
      const isPreview = true;
      nock(URI)
        .get(preLiveRoute)
        .reply(200, {});
      const getGeneralSettingsResult = appModule.getGeneralSettings(undefined, undefined, isPreview);
      expect(getGeneralSettingsResult).toHaveProperty('then');
      expect(getGeneralSettingsResult).toHaveProperty('catch');
    });
    it('should return promise GUEST SPACE', () => {
      const isPreview = true;
      nock(URI)
        .get(guest_PreLiveRoute)
        .reply(200, {});
      const getGeneralSettingsResult = appModule_Guest_Space.getGeneralSettings(undefined, undefined, isPreview);
      expect(getGeneralSettingsResult).toHaveProperty('then');
      expect(getGeneralSettingsResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid request', () => {
      describe('Pre-live app', () => {
        it('[GeneralSetting-3-6]should get successfully the PRE-LIVE app general settings information', () => {
          const data = {
            'app': 1,
            'lang': 'en'
          };
          const isPreview = true;

          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${preLiveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-9]should get successfully the PRE-LIVE app general settings information in GUEST SPACE', () => {
          const data = {
            'app': 1,
            'lang': 'en'
          };
          const isPreview = true;
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${guest_PreLiveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule_Guest_Space.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
      });
      describe('Live app', () => {
        it('[GeneralSetting-4]should get successfully the app general settings information', () => {
          const data = {
            'app': 1,
            'lang': 'en'
          };
          const isPreview = false;

          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${liveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-9]should get successfully the app general settings information in GUEST SPACE', () => {
          const data = {
            'app': 1,
            'lang': 'en'
          };
          const isPreview = false;
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${guest_LiveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule_Guest_Space.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-7]should get successfully the app general settings information without isPreview param', () => {
          const data = {
            'app': 1,
            'lang': 'en'
          };
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${liveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(data.app, data.lang);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-9]should get successfully the app general settings information in GUEST SPACE without isPreview param', () => {
          const data = {
            'app': 1,
            'lang': 'en'
          };
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${guest_LiveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule_Guest_Space.getGeneralSettings(data.app, data.lang);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
      });
    });
    describe('Localized language', () => {
      describe('Pre-live app', () => {
        it('[GeneralSetting-5]should get successfully the PRE-LIVE app general settings information with DEFAULT language', () => {
          const data = {
            'app': 1,
            'lang': 'default'
          };
          const isPreview = true;
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${preLiveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-5]should get successfully the PRE-LIVE app general settings information with ZH language', () => {
          const data = {
            'app': 1,
            'lang': 'ZH'
          };
          const isPreview = true;
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${preLiveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-5]should get successfully the PRE-LIVE app general settings information with JA language', () => {
          const data = {
            'app': 1,
            'lang': 'JA'
          };
          const isPreview = true;
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${preLiveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-5]should get successfully the PRE-LIVE app general settings information with USER language', () => {
          const data = {
            'app': 1,
            'lang': 'USER'
          };
          const isPreview = true;
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${preLiveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-5]should get successfully the PRE-LIVE app general settings information with DEFAULT language in GUEST SPACE', () => {
          const data = {
            'app': 1,
            'lang': 'default'
          };
          const isPreview = true;
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${guest_PreLiveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule_Guest_Space.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-5]should get successfully the PRE-LIVE app general settings information with ZH language in GUEST SPACE', () => {
          const data = {
            'app': 1,
            'lang': 'ZH'
          };
          const isPreview = true;
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${guest_PreLiveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule_Guest_Space.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-5]should get successfully the PRE-LIVE app general settings information with JA language in GUEST SPACE', () => {
          const data = {
            'app': 1,
            'lang': 'JA'
          };
          const isPreview = true;
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${guest_PreLiveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule_Guest_Space.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-5]should get successfully the PRE-LIVE app general settings information with USER language in GUEST SPACE', () => {
          const data = {
            'app': 1,
            'lang': 'USER'
          };
          const isPreview = true;
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${guest_PreLiveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule_Guest_Space.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
      });
      describe('Live app', () => {
        it('[GeneralSetting-5]should get successfully the app general settings information with DEFAULT language', () => {
          const data = {
            'app': 1,
            'lang': 'default'
          };
          const isPreview = false;
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${liveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-5]should get successfully the app general settings information with ZH language', () => {
          const data = {
            'app': 1,
            'lang': 'ZH'
          };
          const isPreview = false;
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${liveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-5]should get successfully the app general settings information with JA language', () => {
          const data = {
            'app': 1,
            'lang': 'JA'
          };
          const isPreview = false;
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${liveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-5]should get successfully the app general settings information with USER language', () => {
          const data = {
            'app': 1,
            'lang': 'USER'
          };
          const isPreview = false;
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${liveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-5]should get successfully the app general settings information with DEFAULT language without isPreview param', () => {
          const data = {
            'app': 1,
            'lang': 'default'
          };
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${liveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(data.app, data.lang);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-5]should get successfully the app general settings information with DEFAULT language in GUEST SPACE', () => {
          const data = {
            'app': 1,
            'lang': 'default'
          };
          const isPreview = false;
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${guest_LiveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule_Guest_Space.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-5]should get successfully the app general settings information with ZH language in GUEST SPACE', () => {
          const data = {
            'app': 1,
            'lang': 'ZH'
          };
          const isPreview = false;
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${guest_LiveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule_Guest_Space.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-5]should get successfully the app general settings information with JA language in GUEST SPACE', () => {
          const data = {
            'app': 1,
            'lang': 'JA'
          };
          const isPreview = false;
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${guest_LiveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule_Guest_Space.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-5]should get successfully the app general settings information with USER language in GUEST SPACE', () => {
          const data = {
            'app': 1,
            'lang': 'USER'
          };
          const isPreview = false;
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${guest_LiveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule_Guest_Space.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
        it(`[GeneralSetting-5]should get successfully the app general settings information with DEFAULT language without isPreview param
        in GUEST SPACE`, () => {
          const data = {
            'app': 1,
            'lang': 'default'
          };
          const expectResult = {
            'name': 'San Francisco Lunch Map',
            'description': 'A list of great places to go!',
            'icon': {
              'type': 'PRESET',
              'key': 'APP60'
            },
            'theme': 'WHITE',
            'revision': '24'
          };
          nock(URI)
            .get(`${guest_LiveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
              expect(authHeader).toBe(common.getPasswordAuth(common.USERNAME, common.PASSWORD));
              return true;
            })
            .reply(200, expectResult);
          const getGeneralSettingsResult = appModule_Guest_Space.getGeneralSettings(data.app, data.lang);
          return getGeneralSettingsResult.then((rsp) => {
            expect(rsp).toEqual(expectResult);
          });
        });
      });
    });
  });

  describe('error case', () => {
    describe('Invalid request', () => {
      describe('Pre-live app', () => {
        it('[GeneralSetting-2]should return error when use API token PRE-LIVE', () => {
          const data = {
            app: 1,
            lang: 'EN'
          };
          const isPreview = true;
          const expectResult = {
            'code': 'GAIA_NO01',
            'id': 'RIQcWU4VAOSt0SXMlcMp',
            'message': 'Using this API token, you cannot run the specified API.',
            'errors': '{}'
          };
          nock(URI)
            .get(`${preLiveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.API_TOKEN, (authHeader) => {
              expect(authHeader).toBe(auth_API.getApiToken());
              return true;
            })
            .reply(403, expectResult);
          const getGeneralSettingsResult = appModule_API.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.catch((err) => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-10]should return error when input no PRE-LIVE appID', () => {
          const isPreview = true;
          const expectResult = {
            'code': 'CB_VA01',
            'id': 'GmKAGRS3J2dH3UdG0bsx',
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
            .get(`${preLiveRoute}`)
            .reply(400, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(undefined, undefined, isPreview);
          return getGeneralSettingsResult.catch((err) => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-7-12]should return error when the PRE-LIVE appID is none exist', () => {
          const appID = 444444;
          const isPreview = true;
          const expectResult = {
            'code': 'GAIA_AP01',
            'id': 'K45k0CEPV5802MKyPcu1',
            'message': 'The app (ID: 444444) not found. The app may have been deleted.',
            'errors': '{}'
          };

          nock(URI)
            .get(`${preLiveRoute}?app=${appID}`)
            .reply(404, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(appID, undefined, isPreview);

          return getGeneralSettingsResult.catch((err) => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-12]should return error when input the negative PRE-LIVE appID', () => {
          const appID = -1;
          const isPreview = true;
          const expectResult = {
            'code': 'CB_VA01',
            'id': 'G5MOiPwnRgN4x7VsQBzC',
            'message': 'Missing or invalid input.',
            'errors': {
              'app': {
                'messages': [
                  'must be greater than or equal to 1'
                ]
              }
            }
          };
          nock(URI)
            .get(`${preLiveRoute}?app=${appID}`)
            .reply(400, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(appID, undefined, isPreview);

          return getGeneralSettingsResult.catch((err) => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-12]should return error when input the zero PRE-LIVE appID', () => {
          const appID = 0;
          const isPreview = true;
          const expectResult = {
            'code': 'CB_VA01',
            'id': 'G5MOiPwnRgN4x7VsQBzC',
            'message': 'Missing or invalid input.',
            'errors': {
              'app': {
                'messages': [
                  'must be greater than or equal to 1'
                ]
              }
            }
          };
          nock(URI)
            .get(`${preLiveRoute}?app=${appID}`)
            .reply(404, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(appID, undefined, isPreview);

          return getGeneralSettingsResult.catch((err) => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-13]should return error when input the invalid PRE-LIVE language', () => {
          const data = {
            app: 1,
            lang: 'invalid'
          };
          const isPreview = true;
          const expectResult = {
            'code': 'CB_VA01',
            'id': 'G5MOiPwnRgN4x7VsQBzC',
            'message': 'Missing or invalid input.',
            'errors': {
              'app': {
                'messages': [
                  'must be greater than or equal to 1'
                ]
              }
            }
          };
          nock(URI)
            .get(`${preLiveRoute}?app=${data.app}&lang=${data.lang}`)
            .reply(400, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(data.app, data.lang, isPreview);

          return getGeneralSettingsResult.catch((err) => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-2]should return error when use API token PRE-LIVE in GUEST SPACE', () => {
          const data = {
            app: 1,
            lang: 'EN'
          };
          const isPreview = true;
          const expectResult = {
            'code': 'GAIA_NO01',
            'id': 'RIQcWU4VAOSt0SXMlcMp',
            'message': 'Using this API token, you cannot run the specified API.',
            'errors': '{}'
          };
          nock(URI)
            .get(`${guest_PreLiveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.API_TOKEN, (authHeader) => {
              expect(authHeader).toBe(auth_API.getApiToken());
              return true;
            })
            .reply(403, expectResult);
          const getGeneralSettingsResult = appModule_API_Guest_Space.getGeneralSettings(data.app, data.lang, isPreview);

          return getGeneralSettingsResult.catch((err) => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-10]should return error when input no PRE-LIVE appID in GUEST SPACE', () => {
          const isPreview = true;
          const expectResult = {
            'code': 'CB_VA01',
            'id': 'GmKAGRS3J2dH3UdG0bsx',
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
            .get(`${guest_PreLiveRoute}`)
            .reply(400, expectResult);
          const getGeneralSettingsResult = appModule_Guest_Space.getGeneralSettings(undefined, undefined, isPreview);

          return getGeneralSettingsResult.catch((err) => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-7-12]should return error when the PRE-LIVE appID is none exist in GUEST SPACE', () => {
          const appID = 444444;
          const isPreview = true;
          const expectResult = {
            'code': 'GAIA_AP01',
            'id': 'K45k0CEPV5802MKyPcu1',
            'message': 'The app (ID: 444444) not found. The app may have been deleted.',
            'errors': '{}'
          };
          nock(URI)
            .get(`${guest_PreLiveRoute}?app=${appID}`)
            .reply(404, expectResult);
          const getGeneralSettingsResult = appModule_Guest_Space.getGeneralSettings(appID, undefined, isPreview);

          return getGeneralSettingsResult.catch((err) => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-12]should return error when input the negative PRE-LIVE appID in GUEST SPACE', () => {
          const appID = -1;
          const isPreview = true;
          const expectResult = {
            'code': 'CB_VA01',
            'id': 'G5MOiPwnRgN4x7VsQBzC',
            'message': 'Missing or invalid input.',
            'errors': {
              'app': {
                'messages': [
                  'must be greater than or equal to 1'
                ]
              }
            }
          };
          nock(URI)
            .get(`${guest_PreLiveRoute}?app=${appID}`)
            .reply(400, expectResult);
          const getGeneralSettingsResult = appModule_Guest_Space.getGeneralSettings(appID, undefined, isPreview);

          return getGeneralSettingsResult.catch((err) => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-12]should return error when input the zero PRE-LIVE appID in GUEST SPACE', () => {
          const appID = 0;
          const isPreview = true;
          const expectResult = {
            'code': 'CB_VA01',
            'id': 'G5MOiPwnRgN4x7VsQBzC',
            'message': 'Missing or invalid input.',
            'errors': {
              'app': {
                'messages': [
                  'must be greater than or equal to 1'
                ]
              }
            }
          };
          nock(URI)
            .get(`${guest_PreLiveRoute}?app=${appID}`)
            .reply(404, expectResult);
          const getGeneralSettingsResult = appModule_Guest_Space.getGeneralSettings(appID, undefined, isPreview);

          return getGeneralSettingsResult.catch((err) => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-13]should return error when input the invalid PRE-LIVE language in GUEST SPACE', () => {
          const data = {
            app: 1,
            lang: 'invalid'
          };
          const isPreview = true;
          const expectResult = {
            'code': 'CB_VA01',
            'id': 'G5MOiPwnRgN4x7VsQBzC',
            'message': 'Missing or invalid input.',
            'errors': {
              'app': {
                'messages': [
                  'must be greater than or equal to 1'
                ]
              }
            }
          };
          nock(URI)
            .get(`${guest_PreLiveRoute}?app=${data.app}&lang=${data.lang}`)
            .reply(400, expectResult);
          const getGeneralSettingsResult = appModule_Guest_Space.getGeneralSettings(data.app, data.lang, isPreview);

          return getGeneralSettingsResult.catch((err) => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toEqual(expectResult);
          });
        });
      });
      describe('Live app', () => {
        it('[GeneralSetting-2]should return error when use API token', () => {
          const data = {
            app: 1,
            lang: 'EN'
          };
          const isPreview = false;
          const expectResult = {
            'code': 'GAIA_NO01',
            'id': 'RIQcWU4VAOSt0SXMlcMp',
            'message': 'Using this API token, you cannot run the specified API.',
            'errors': '{}'
          };
          nock(URI)
            .get(`${liveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.API_TOKEN, (authHeader) => {
              expect(authHeader).toBe(auth_API.getApiToken());
              return true;
            })
            .reply(403, expectResult);
          const getGeneralSettingsResult = appModule_API.getGeneralSettings(data.app, data.lang, isPreview);

          return getGeneralSettingsResult.catch((err) => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-10]should return error when input no appID', () => {
          const expectResult = {
            'code': 'CB_VA01',
            'id': 'GmKAGRS3J2dH3UdG0bsx',
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
            .get(`${liveRoute}`)
            .reply(400, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(undefined);

          return getGeneralSettingsResult.catch((err) => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-12]should return error when the appID is none exist', () => {
          const appID = 444444;
          const isPreview = false;
          const expectResult = {
            'code': 'CB_VA01',
            'id': 'gR0woWPqBAIUpgxe98J4',
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
            .get(`${liveRoute}?app=${appID}`)
            .reply(404, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(appID, undefined, isPreview);

          return getGeneralSettingsResult.catch((err) => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-12]should return error when input the negative appID', () => {
          const appID = -1;
          const isPreview = false;
          const expectResult = {
            'code': 'CB_VA01',
            'id': 'G5MOiPwnRgN4x7VsQBzC',
            'message': 'Missing or invalid input.',
            'errors': {
              'app': {
                'messages': [
                  'must be greater than or equal to 1'
                ]
              }
            }
          };
          nock(URI)
            .get(`${liveRoute}?app=${appID}`)
            .reply(400, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(appID, undefined, isPreview);

          return getGeneralSettingsResult.catch((err) => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-12]should return error when input the zero appID', () => {
          const appID = 0;
          const isPreview = false;
          const expectResult = {
            'code': 'CB_VA01',
            'id': 'G5MOiPwnRgN4x7VsQBzC',
            'message': 'Missing or invalid input.',
            'errors': {
              'app': {
                'messages': [
                  'must be greater than or equal to 1'
                ]
              }
            }
          };
          nock(URI)
            .get(`${liveRoute}?app=${appID}`)
            .reply(400, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(appID, undefined, isPreview);

          return getGeneralSettingsResult.catch((err) => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-13]should return error when input the invalid language', () => {
          const data = {
            app: 1,
            lang: 'invalid'
          };
          const isPreview = false;
          const expectResult = {
            'code': 'CB_VA01',
            'id': 'G5MOiPwnRgN4x7VsQBzC',
            'message': 'Missing or invalid input.',
            'errors': {
              'app': {
                'messages': [
                  'must be greater than or equal to 1'
                ]
              }
            }
          };
          nock(URI)
            .get(`${liveRoute}?app=${data.app}&lang=${data.lang}`)
            .reply(400, expectResult);
          const getGeneralSettingsResult = appModule.getGeneralSettings(data.app, data.lang, isPreview);
          return getGeneralSettingsResult.catch((err) => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toEqual(expectResult);
          });
        });
        it('[GeneralSetting-2]should return error when use API token without isPreview param', () => {
          const data = {
            app: 1,
            lang: 'EN'
          };
          const expectResult = {
            'code': 'GAIA_NO01',
            'id': 'RIQcWU4VAOSt0SXMlcMp',
            'message': 'Using this API token, you cannot run the specified API.',
            'errors': '{}'
          };
          nock(URI)
            .get(`${liveRoute}?app=${data.app}&lang=${data.lang}`)
            .matchHeader(common.API_TOKEN, (authHeader) => {
              expect(authHeader).toBe(auth_API.getApiToken());
              return true;
            })
            .reply(403, expectResult);
          const getGeneralSettingsResult = appModule_API.getGeneralSettings(data.app, data.lang);

          return getGeneralSettingsResult.catch((err) => {
            expect(err).toBeInstanceOf(KintoneAPIException);
            expect(err.get()).toEqual(expectResult);
          });
        });
      });
    });
  });
});
