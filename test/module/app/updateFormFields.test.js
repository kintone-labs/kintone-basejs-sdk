
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

describe('updateFormFields function', () => {
  describe('common function', () => {
    const app = 1;
    it('should return promise', () => {
      nock(URI)
        .put('/k/v1/preview/app/form/fields.json')
        .reply(200, {});

      const getAppResult = appModule.updateFormFields(app);
      expect(getAppResult).toHaveProperty('then');
      expect(getAppResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid request', () => {
      it('[Form-52] should update successfully the app formfield', () => {
        const data = {
          'app': 1,
          'properties': {
            'Text__single_line_1': {
              'type': 'SINGLE_LINE_TEXT',
              'code': 'Text__single_line_1',
              'label': 'Text (single-line)',
              'noLabel': false,
              'required': true
            }
          },
          revision: 2
        };
        const expectResult = {
          'revision': '1'
        };
        nock(URI)
          .put('/k/v1/preview/app/form/fields.json', (rqBody) => {
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

        const updateFormFieldsResult = appModule.updateFormFields(data.app, data.properties, data.revision);
        return updateFormFieldsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Valid data - Without revision', () => {
      it('[Form-53] should update successfully the app formfield', () => {
        const data = {
          'app': 1,
          'properties': {
            'Text__single_line_1': {
              'type': 'SINGLE_LINE_TEXT',
              'code': 'Text__single_line_1',
              'label': 'Text (single-line)',
              'noLabel': false,
              'required': true
            }
          },
        };
        const expectResult = {
          'revision': '3'
        };
        nock(URI)
          .put('/k/v1/preview/app/form/fields.json', (rqBody) => {
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

        const updateFormFieldsResult = appModule.updateFormFields(data.app, data.properties, data.revision);
        return updateFormFieldsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Valid data - Ignore revision -1', () => {
      it('[Form-54] should update successfully the app formfield', () => {
        const data = {
          'app': 1,
          'properties': {
            'Text__single_line_1': {
              'type': 'SINGLE_LINE_TEXT',
              'code': 'Text__single_line_1',
              'label': 'Text (single-line)',
              'noLabel': false,
              'required': true
            }
          },
          revision: -1
        };
        const expectResult = {
          'revision': '3'
        };
        nock(URI)
          .put('/k/v1/preview/app/form/fields.json', (rqBody) => {
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

        const updateFormFieldsResult = appModule.updateFormFields(data.app, data.properties, data.revision);
        return updateFormFieldsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify add form fields for app in guest space successfully', () => {
      it('[Form-55] should update successfully the app formfield', () => {
        const data = {
          'app': 1,
          'properties': {
            'Text__single_line_1': {
              'type': 'SINGLE_LINE_TEXT',
              'code': 'Text__single_line_1',
              'label': 'Text (single-line)',
              'noLabel': false,
              'required': true
            }
          },
          revision: -1
        };
        const expectResult = {
          'revision': '3'
        };
        nock(URI)
          .put('/k/guest/1/v1/preview/app/form/fields.json', (rqBody) => {
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
        const guestappModule = new App(conn1);

        const updateFormFieldsResult = guestappModule.updateFormFields(data.app, data.properties, data.revision);
        return updateFormFieldsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify the app deploy status is still displayed when executing with ID as string type', () => {
      it('[Form-56] should update successfully the app formfield', () => {
        const data = {
          'app': '1',
          'properties': {
            'Text__single_line_1': {
              'type': 'SINGLE_LINE_TEXT',
              'code': 'Text__single_line_1',
              'label': 'Text (single-line)',
              'noLabel': false,
              'required': true
            }
          },
          revision: -1
        };
        const expectResult = {
          'revision': '3'
        };
        nock(URI)
          .put('/k/v1/preview/app/form/fields.json', (rqBody) => {
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

        const updateFormFieldsResult = appModule.updateFormFields(data.app, data.properties, data.revision);
        return updateFormFieldsResult.then((rsp) => {
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

      it('[Form-51] should return error when using API token authentication ', () => {
        const expectResult = {
          'code': 'GAIA_NO01',
          'id': 'lzQPJ1hkW3Aj4iVebWCG',
          'message': 'Using this API token, you cannot run the specified API.'
        };
        nock(URI)
          .put('/k/v1/preview/app/form/fields.json')
          .matchHeader(common.API_TOKEN, (authHeader) => {
            expect(authHeader).toBe('a2386gf84gd663a12s32s');
            return true;
          })
          .reply(403, expectResult);
        const updateFormFieldsResult = appUsingtOKEN.updateFormFields(10);
        return updateFormFieldsResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will be displayed when using method without app ID', () => {
      it('[Form-57] should update successfully the app formfield', () => {
        const data = {
          'properties': {
            'Text__single_line_1': {
              'type': 'SINGLE_LINE_TEXT',
              'code': 'Text__single_line_1',
              'label': 'Text (single-line)',
              'noLabel': false,
              'required': true
            }
          },
          revision: 2
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'ndfhXS54zXKBDn4ReHtV',
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
          .put('/k/v1/preview/app/form/fields.json', (rqBody) => {
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

        const updateFormFieldsResult = appModule.updateFormFields('', data.properties, data.revision);
        return updateFormFieldsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will be displayed when using method without fields properties', () => {
      it('[Form-58] should update successfully the app formfield', () => {
        const data = {
          'app': 1,
          revision: 2
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'THuBwhx0GjjwGkUgxAxR',
          'message': 'Missing or invalid input.',
          'errors': {
            'properties': {
              'messages': [
                'Required field.'
              ]
            }
          }
        };
        nock(URI)
          .put('/k/v1/preview/app/form/fields.json', (rqBody) => {
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

        const updateFormFieldsResult = appModule.updateFormFields(data.app, '', data.revision);
        return updateFormFieldsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will be displayed when using invalid app ID', () => {
      it('[Form-59] should update successfully the app formfield', () => {
        const data = {
          'app': 'abc',
          'properties': {
            'Text__single_line_1': {
              'type': 'SINGLE_LINE_TEXT',
              'code': 'Text__single_line_1',
              'label': 'Text (single-line)',
              'noLabel': false,
              'required': true
            }
          },
          revision: 2
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'UNtiX46T818TL4zagnpH',
          'message': 'Missing or invalid input.',
          'errors': {
            'app': {
              'messages': [
                'Enter an integer value.'
              ]
            }
          }
        };
        nock(URI)
          .put('/k/v1/preview/app/form/fields.json', (rqBody) => {
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

        const updateFormFieldsResult = appModule.updateFormFields(data.app, data.properties, data.revision);
        return updateFormFieldsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will display when user input invalid fields code', () => {
      it('[Form-60] should update successfully the app formfield', () => {
        const data = {
          'app': 1,
          'properties': {
            'Text': {
              'type': '10000',
              'code': 'Text',
              'label': 'Text (single-line)',
              'noLabel': false,
              'required': true
            }
          },
          revision: 2
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'HIWfe9xlrzmOvqMpUfv2',
          'message': 'Missing or invalid input.',
          'errors': {
            'properties[Text].type': {
              'messages': [
                'must be one of the enum value'
              ]
            }
          }
        };
        nock(URI)
          .put('/k/v1/preview/app/form/fields.json', (rqBody) => {
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

        const updateFormFieldsResult = appModule.updateFormFields(data.app, data.properties, data.revision);
        return updateFormFieldsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error is displayed when input invalid revision', () => {
      it('[Form-61] should update successfully the app formfield', () => {
        const data = {
          'app': 1,
          'properties': {
            'Text__single_line_1': {
              'type': 'SINGLE_LINE_TEXT',
              'code': 'Text__single_line_1',
              'label': 'Text (single-line)',
              'noLabel': false,
              'required': true
            }
          },
          revision: 'abc'
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'UNtiX46T818TL4zagnpH',
          'message': 'Missing or invalid input.',
          'errors': {
            'app': {
              'messages': [
                'Enter an integer value.'
              ]
            }
          }
        };
        nock(URI)
          .put('/k/v1/preview/app/form/fields.json', (rqBody) => {
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

        const updateFormFieldsResult = appModule.updateFormFields(data.app, data.properties, data.revision);
        return updateFormFieldsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
  });
});
