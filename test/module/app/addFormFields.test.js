
/**
 * kintone api - nodejs client
 * test app module
 */
const nock = require('nock');

const common = require('../../../test/utils/common');

const {Connection, Auth, App, KintoneException} = require(common.MAIN_PATH);

const URI = 'https://' + common.DOMAIN;

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

const appModule = new App(conn);

describe('addFormFields function', () => {
  describe('common function', () => {
    const app = 1;
    it('should return promise', () => {
      nock(URI)
        .post('/k/v1/preview/app/form/fields.json')
        .reply(200, {});

      const getAppResult = appModule.addFormFields(app);
      expect(getAppResult).toHaveProperty('then');
      expect(getAppResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid request', () => {
      it('[Form-28] should add successfully the app formfield', () => {
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
          'properties': {
            'Text__single_line_1': {
              'type': 'SINGLE_LINE_TEXT',
              'code': 'Text__single_line_1',
              'label': 'Text (single-line)',
              'noLabel': false,
              'required': true,
              'unique': true,
              'maxLength': '64',
              'minLength': '0',
              'defaultValue': '',
              'expression': '',
              'hideExpression': false
            },
            'revision': '2'
          }
        };
        nock(URI)
          .post('/k/v1/preview/app/form/fields.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
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
          .reply(200, expectResult);

        const addFormFieldsResult = appModule.addFormFields(data.app, data.properties, data.revision);
        return addFormFieldsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Valid data - Without revision', () => {
      it('[Form-29] - should add successfully the app formfield', () => {
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
          'properties': {
            'Text__single_line_1': {
              'type': 'SINGLE_LINE_TEXT',
              'code': 'Text__single_line_1',
              'label': 'Text (single-line)',
              'noLabel': false,
              'required': true,
              'unique': true,
              'maxLength': '64',
              'minLength': '0',
              'defaultValue': '',
              'expression': '',
              'hideExpression': false
            },
            'revision': '2'
          }
        };
        nock(URI)
          .post('/k/v1/preview/app/form/fields.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
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
          .reply(200, expectResult);

        const addFormFieldsResult = appModule.addFormFields(data.app, data.properties, '');
        return addFormFieldsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Valid data - Ignore revision -1', () => {
      it('[Form-30] - should add successfully the app formfield', () => {
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
          'properties': {
            'Text__single_line_1': {
              'type': 'SINGLE_LINE_TEXT',
              'code': 'Text__single_line_1',
              'label': 'Text (single-line)',
              'noLabel': false,
              'required': true,
              'unique': true,
              'maxLength': '64',
              'minLength': '0',
              'defaultValue': '',
              'expression': '',
              'hideExpression': false
            },
            'revision': '2'
          }
        };
        nock(URI)
          .post('/k/v1/preview/app/form/fields.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
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
          .reply(200, expectResult);

        const addFormFieldsResult = appModule.addFormFields(data.app, data.properties, data.revision);
        return addFormFieldsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify the app deploy status is still displayed when executing with ID as string type', () => {
      it('[Form-32] - should add successfully the app formfield', () => {
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
          revision: 1
        };
        const expectResult = {
          'properties': {
            'Text__single_line_1': {
              'type': 'SINGLE_LINE_TEXT',
              'code': 'Text__single_line_1',
              'label': 'Text (single-line)',
              'noLabel': false,
              'required': true,
              'unique': true,
              'maxLength': '64',
              'minLength': '0',
              'defaultValue': '',
              'expression': '',
              'hideExpression': false
            },
            'revision': '2'
          }
        };
        nock(URI)
          .post('/k/v1/preview/app/form/fields.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
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
          .reply(200, expectResult);

        const addFormFieldsResult = appModule.addFormFields(data.app, data.properties, data.revision);
        return addFormFieldsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify add form fields for app in guest space successfully', () => {
      it('[Form-31] - should add successfully the app formfield', () => {
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
          revision: 1
        };
        const expectResult = {
          'properties': {
            'Text__single_line_1': {
              'type': 'SINGLE_LINE_TEXT',
              'code': 'Text__single_line_1',
              'label': 'Text (single-line)',
              'noLabel': false,
              'required': true,
              'unique': true,
              'maxLength': '64',
              'minLength': '0',
              'defaultValue': '',
              'expression': '',
              'hideExpression': false
            },
            'revision': '2'
          }
        };
        nock(URI)
          .post('/k/guest/1/v1/preview/app/form/fields.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
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
          .reply(200, expectResult);
        const conn1 = new Connection(common.DOMAIN, auth, common.GUEST_SPACEID);
        const guestappModule = new App(conn1);

        const addFormFieldsResult = guestappModule.addFormFields(data.app, data.properties, data.revision);
        return addFormFieldsResult.then((rsp) => {
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

      it('[Form-27] should return error when using API token authentication ', () => {
        const expectResult = {
          'code': 'GAIA_NO01',
          'id': 'lzQPJ1hkW3Aj4iVebWCG',
          'message': 'Using this API token, you cannot run the specified API.'
        };
        nock(URI)
          .post('/k/v1/preview/app/form/fields.json')
          .matchHeader(common.API_TOKEN, (authHeader) => {
            expect(authHeader).toBe('a2386gf84gd663a12s32s');
            return true;
          })
          .reply(520, expectResult);
        const addFormFieldsResult = appUsingtOKEN.addFormFields(10);
        return addFormFieldsResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will be displayed when using method without app ID', () => {
      it('[Form-33] - should return error in the results', () => {
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
          revision: -1
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'ZPClIAwkXV1qd2BRB4TM',
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
          .post('/k/v1/preview/app/form/fields.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
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
          .reply(400, expectResult);

        const addFormFieldsResult = appModule.addFormFields('', data.properties, data.revision);
        return addFormFieldsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will be displayed when using method without fields properties', () => {
      it('[Form-34] - should return error in the results', () => {
        const data = {
          'app': 1,
          revision: -1
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'bND4RRQUaYAhparzun86',
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
          .post('/k/v1/preview/app/form/fields.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
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
          .reply(400, expectResult);

        const addFormFieldsResult = appModule.addFormFields(data.app, '', data.revision);
        return addFormFieldsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will be displayed when using invalid app ID', () => {
      it('[Form-35] - should return error in the results', () => {
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
          revision: -1
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'DK1r5WLs04wwvcuqfP4P',
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
          .post('/k/v1/preview/app/form/fields.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
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
          .reply(400, expectResult);

        const addFormFieldsResult = appModule.addFormFields(data.app, data.properties, data.revision);
        return addFormFieldsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will display when user input invalid fields type', () => {
      it('[Form-36] - should return error in the results', () => {
        const data = {
          'app': 1,
          'properties': {
            'Text__single_line_1': {
              'type': '10000',
              'code': 'Text__single_line_1',
              'label': 'Text (single-line)',
              'noLabel': false,
              'required': true
            }
          },
          revision: -1
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'Ty07w5txHYvBAnvxjhyT',
          'message': 'Missing or invalid input.',
          'errors': {
            'properties[Text__single_line_1].type': {
              'messages': [
                'must be one of the enum value'
              ]
            }
          }
        };
        nock(URI)
          .post('/k/v1/preview/app/form/fields.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
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
          .reply(400, expectResult);

        const addFormFieldsResult = appModule.addFormFields(data.app, data.properties, data.revision);
        return addFormFieldsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error is displayed when input invalid revision', () => {
      it('[Form-37] - should return error in the results', () => {
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
          'id': '8LImrSKPmYS4shSa9UEJ',
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
          .post('/k/v1/preview/app/form/fields.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
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
          .reply(400, expectResult);

        const addFormFieldsResult = appModule.addFormFields(data.app, data.properties, data.revision);
        return addFormFieldsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will display when user does not have App Management Permissions', () => {
      it('[Form-38] - should return error in the results', () => {
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
          'code': 'CB_NO02',
          'id': 'znxMA8JNWGXAtWvC5HEc',
          'message': 'No privilege to proceed.'
        };
        nock(URI)
          .post('/k/v1/preview/app/form/fields.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
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
          .reply(403, expectResult);

        const addFormFieldsResult = appModule.addFormFields(data.app, data.properties, data.revision);
        return addFormFieldsResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
  });
});
