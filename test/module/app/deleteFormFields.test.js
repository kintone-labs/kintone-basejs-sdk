
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

describe('deleteFormFields function', () => {
  describe('common function', () => {
    const app = 1;
    it('should return promise', () => {
      nock(URI)
        .intercept('/k/v1/preview/app/form/fields.json', 'DELETE')
        .reply(200, {});

      const getAppResult = appModule.deleteFormFields(app);
      expect(getAppResult).toHaveProperty('then');
      expect(getAppResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid request', () => {
      it('[Form-40] should update successfully the app formfield', () => {
        const data = {
          'app': 1,
          'fields': [
            'Text__single_line_1',
            'Number'
          ],
          revision: 12
        };
        const expectResult = {
          'revision': '13'
        };
        nock(URI)
          .intercept('/k/v1/preview/app/form/fields.json', 'DELETE', (rqBody) => {
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

        const deleteFormFieldsResult = appModule.deleteFormFields(data.app, data.fields, data.revision);
        return deleteFormFieldsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Valid data - Without revision', () => {
      it('[Form-41] should update successfully the app formfield', () => {
        const data = {
          'app': 1,
          'fields': [
            'Text__single_line_1',
            'Number'
          ],
        };
        const expectResult = {
          'revision': '13'
        };
        nock(URI)
          .intercept('/k/v1/preview/app/form/fields.json', 'DELETE', (rqBody) => {
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

        const deleteFormFieldsResult = appModule.deleteFormFields(data.app, data.fields, '');
        return deleteFormFieldsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Valid data - Ignore revision -1', () => {
      it('[Form-42] should update successfully the app formfield', () => {
        const data = {
          'app': 1,
          'fields': [
            'Text__single_line_1',
            'Number'
          ],
          revision: -1,
        };
        const expectResult = {
          'revision': '13'
        };
        nock(URI)
          .intercept('/k/v1/preview/app/form/fields.json', 'DELETE', (rqBody) => {
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

        const deleteFormFieldsResult = appModule.deleteFormFields(data.app, data.fields, data.revision);
        return deleteFormFieldsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify delete form fields for app in guest space successfully', () => {
      it('[Form-43] should update successfully the app formfield', () => {
        const data = {
          'app': 1,
          'fields': [
            'Text__single_line_1',
            'Number'
          ],
          revision: -1,
        };
        const expectResult = {
          'revision': '13'
        };
        nock(URI)
          .intercept('/k/guest/1/v1/preview/app/form/fields.json', 'DELETE', (rqBody) => {
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

        const deleteFormFieldsResult = guestappModule.deleteFormFields(data.app, data.fields, data.revision);
        return deleteFormFieldsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify the app deploy status is still displayed when executing with ID as string type', () => {
      it('[Form-44] should update successfully the app formfield', () => {
        const data = {
          'app': '1',
          'fields': [
            'Text__single_line_1',
            'Number'
          ],
          revision: -1,
        };
        const expectResult = {
          'revision': '13'
        };
        nock(URI)
          .intercept('/k/v1/preview/app/form/fields.json', 'DELETE', (rqBody) => {
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

        const deleteFormFieldsResult = appModule.deleteFormFields(data.app, data.fields, data.revision);
        return deleteFormFieldsResult.then((rsp) => {
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

      it('[Form-41] should return error when using API token authentication ', () => {
        const expectResult = {
          'code': 'GAIA_NO01',
          'id': 'lzQPJ1hkW3Aj4iVebWCG',
          'message': 'Using this API token, you cannot run the specified API.'
        };
        nock(URI)
          .intercept('/k/v1/preview/app/form/fields.json', 'DELETE')
          .matchHeader(common.API_TOKEN, (authHeader) => {
            expect(authHeader).toBe('a2386gf84gd663a12s32s');
            return true;
          })
          .reply(520, expectResult);
        const deleteFormFieldsResult = appUsingtOKEN.deleteFormFields(10);
        return deleteFormFieldsResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will be displayed when using method without app ID', () => {
      it('[Form-45] should return error in the result', () => {
        const data = {
          'fields': [
            'Text__single_line_1',
            'Number'
          ],
          revision: -1,
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'hhI8wpbzFOZ0EqG9O7cH',
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
          .intercept('/k/v1/preview/app/form/fields.json', 'DELETE', (rqBody) => {
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

        const deleteFormFieldsResult = appModule.deleteFormFields('', data.fields, data.revision);
        return deleteFormFieldsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will be displayed when using method without fields properties', () => {
      it('[Form-46] should return error in the result', () => {
        const data = {
          'app': 1,
          revision: -1,
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'TLR8F3XyMKxOpBfLpry2',
          'message': 'Missing or invalid input.',
          'errors': {
            'fields': {
              'messages': [
                'Required field.',
                'size must be between 1 and 100'
              ]
            }
          }
        };
        nock(URI)
          .intercept('/k/v1/preview/app/form/fields.json', 'DELETE', (rqBody) => {
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

        const deleteFormFieldsResult = appModule.deleteFormFields(data.app, '', data.revision);
        return deleteFormFieldsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will be displayed when using invalid app ID', () => {
      it('[Form-47] should return error in the result', () => {
        const data = {
          'app': 'abc',
          'fields': [
            'Text__single_line_1',
            'Number'
          ],
          revision: -1,
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'xyuCWKupR9wOlZIpyrh8',
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
          .intercept('/k/v1/preview/app/form/fields.json', 'DELETE', (rqBody) => {
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

        const deleteFormFieldsResult = appModule.deleteFormFields(data.app, data.fields, data.revision);
        return deleteFormFieldsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will display when user input invalid fields code', () => {
      it('[Form-48] should return error in the result', () => {
        const data = {
          'app': 1,
          'fields': [
            'Text__single_line_1',
            'Error_field_code'
          ],
          revision: -1,
        };
        const expectResult = {
          'code': 'GAIA_FC01',
          'id': 'LcabXzdjAOgkoL7J5SSd',
          'message': 'The field (code: Error_field_code) not found.'
        };
        nock(URI)
          .intercept('/k/v1/preview/app/form/fields.json', 'DELETE', (rqBody) => {
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
          .reply(520, expectResult);

        const deleteFormFieldsResult = appModule.deleteFormFields(data.app, data.fields, data.revision);
        return deleteFormFieldsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will display when user input invalid revision', () => {
      it('[Form-49] should return error in the result', () => {
        const data = {
          'app': 1,
          'fields': [
            'Text__single_line_1',
            'Error_field_code'
          ],
          revision: 'abc',
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'FszSqvf3ABeIxuA1W5aY',
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
          .intercept('/k/v1/preview/app/form/fields.json', 'DELETE', (rqBody) => {
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

        const deleteFormFieldsResult = appModule.deleteFormFields(data.app, data.fields, data.revision);
        return deleteFormFieldsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will displayed when items in array fields > 100', () => {
      it('[Form-51] should return error in the result', () => {
        const number = 105;
        const data = {
          'app': 1,
          'fields': 'Text__single_line_1',
          revision: -1,
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': '0ryJt8K03M8WfRdtOj1Z',
          'message': 'Missing or invalid input.',
          'errors': {
            'fields': {
              'messages': [
                'size must be between 1 and 100'
              ]
            }
          }
        };
        nock(URI)
          .intercept('/k/v1/preview/app/form/fields.json', 'DELETE', (rqBody) => {
            expect(rqBody.app).toEqual(data.app);
            expect(rqBody.fields).toMatchObject(common.generateRecord(number, data.fields));
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

        const deleteFormFieldsResult = appModule.deleteFormFields(data.app, common.generateRecord(number, data.fields), data.revision);
        return deleteFormFieldsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneAPIException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
  });
});