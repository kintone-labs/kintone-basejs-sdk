
/**
 * kintone api - nodejs client
 * test record module
 */

const nock = require('nock');
const common = require('../../common');
const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const Record = require('../../../src/module/app/App');


const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

const recordModule = new Record(conn);

describe('getFormFields function', () => {
  describe('common function', () => {
    const app = 1;
    it('should return promise', () => {
      nock('https://' + common.DOMAIN)
        .get('/k/v1/app/form/fields.json')
        .reply(200, {});

      const getAppResult = recordModule.getFormFields(app);
      expect(getAppResult).toHaveProperty('then');
      expect(getAppResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid request', () => {
      it('should return the app formfield base on full data', () => {
        const app = 10;
        const lang = 'EN';
        const isPreview = false;
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
        nock('https://' + common.DOMAIN)
          .get('/k/v1/app/form/fields.json', (rqBody) => {
            expect(rqBody.app).toEqual(app);
            expect(rqBody.lang).toEqual(lang);
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

        const getFormFieldsResult = recordModule.getFormFields(app, lang, isPreview);
        return getFormFieldsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('Verify the data in localization', () => {
      it('should return the app formfield base on full data', () => {
        const app = 10;
        const lang = 'JP';
        const isPreview = false;
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
          },
          'revision': '2'
        };
        nock('https://' + common.DOMAIN)
          .get('/k/v1/app/form/fields.json', (rqBody) => {
            expect(rqBody.app).toEqual(app);
            expect(rqBody.lang).toEqual(lang);
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

        const getFormFieldsResult = recordModule.getFormFields(app, lang, isPreview);
        return getFormFieldsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('Verify the list of fields and field settings of an live App with pre-live settings are returned', () => {
      it('should return the app formfield base on full data', () => {
        const app = 10;
        const lang = 'EN';
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
          },
          'revision': '3'
        };
        nock('https://' + common.DOMAIN)
          .get('/k/v1/app/form/fields.json', (rqBody) => {
            expect(rqBody.app).toEqual(app);
            expect(rqBody.lang).toEqual(lang);
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

        const getFormFieldsResult = recordModule.getFormFields(app, lang, '');
        return getFormFieldsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('Verify the app form field with a pre-live settings is returned when setting isPreview false', () => {
      it('should return the app formfield base on full data', () => {
        const app = 10;
        const lang = 'EN';
        const isPreview = false;
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
            'Date': {
              'type': 'DATE',
              'code': 'Date',
              'label': 'Date',
              'noLabel': false,
              'required': false,
              'unique': false,
              'defaultValue': '',
              'defaultNowValue': true
            }
          },
          'revision': '2'
        };
        nock('https://' + common.DOMAIN)
          .get('/k/v1/app/form/fields.json', (rqBody) => {
            expect(rqBody.app).toEqual(app);
            expect(rqBody.lang).toEqual(lang);
            expect(rqBody.isPreview).toBeFalsy();
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

        const getFormFieldsResult = recordModule.getFormFields(app, lang, isPreview);
        return getFormFieldsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('Verify the app form field with a pre-live settings is returned when setting isPreview true', () => {
      it('should return the app formfield base on full data', () => {
        const app = 10;
        const lang = 'EN';
        const isPreview = true;
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
          },
          'revision': '2'
        };
        nock('https://' + common.DOMAIN)
          .get('/k/v1/preview/app/form/fields.json', (rqBody) => {
            expect(rqBody.app).toEqual(app);
            expect(rqBody.lang).toEqual(lang);
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

        const getFormFieldsResult = recordModule.getFormFields(app, lang, isPreview);
        return getFormFieldsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('Verify the app of Guest Space is returned', () => {
      it('should return the app formfield base on full data', () => {
        const app = 10;
        const lang = 'EN';
        const isPreview = false;
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
          },
          'revision': '2'
        };
        nock('https://' + common.DOMAIN)
          .get('/k/v1/app/form/fields.json', (rqBody) => {
            expect(rqBody.app).toEqual(app);
            expect(rqBody.lang).toEqual(lang);
            expect(rqBody.isPreview).toBeFalsy();
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
        const formField = new Record(conn1);
        const getFormFieldsResult = formField.getFormFields(app, lang, isPreview);
        return getFormFieldsResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });


  });

  describe('error case', () => {
    describe('The error will be displayed when using invalid app ID', () => {
      it('should return the error in the result', () => {
        const app = 'abc';
        const lang = 'EN';
        const isPreview = false;
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'rd70vRQmhixNIPltBzPa',
          'message': 'Missing or invalid input.',
          'errors': {
            'app': {
              'messages': [
                'Enter an integer value.'
              ]
            }
          }
        };
        nock('https://' + common.DOMAIN)
          .get('/k/v1/app/form/fields.json', (rqBody) => {
            expect(rqBody.app).toEqual(app);
            expect(rqBody.lang).toEqual(lang);
            expect(rqBody.isPreview).toBeFalsy();
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

        const getFormFieldsResult = recordModule.getFormFields(app, lang, isPreview);
        return getFormFieldsResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('The error will be displayed when using method without app ID', () => {
      it('should return the error in the result', () => {
        const lang = 'EN';
        const isPreview = false;
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'h6QtUmUVbmuPTcZBLf1I',
          'message': 'Missing or invalid input.',
          'errors': {
            'app': {
              'messages': [
                'Required field.'
              ]
            }
          }
        };
        nock('https://' + common.DOMAIN)
          .get('/k/v1/app/form/fields.json', (rqBody) => {
            expect(rqBody.lang).toEqual(lang);
            expect(rqBody.isPreview).toBeFalsy();
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

        const getFormFieldsResult = recordModule.getFormFields('', lang, isPreview);
        return getFormFieldsResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('The error will be displayed when input invalid language', () => {
      it('should return the error in the result', () => {
        const app = 1;
        const lang = '1';
        const isPreview = false;
        const expectResult = {
          'code': 'CB_VA01',
          'id': '7ZQYN2qOgxdUAQ5n2J1j',
          'message': 'Missing or invalid input.',
          'errors': {
            'lang': {
              'messages': [
                'must be one of the enum value'
              ]
            }
          }
        };
        nock('https://' + common.DOMAIN)
          .get('/k/v1/app/form/fields.json', (rqBody) => {
            expect(rqBody.app).toEqual(app);
            expect(rqBody.lang).toEqual(lang);
            expect(rqBody.isPreview).toBeFalsy();
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

        const getFormFieldsResult = recordModule.getFormFields(app, lang, isPreview);
        return getFormFieldsResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('Error will be displayed when using this method with pre-live settings with user who does not have Permission to manage the App', () => {
      it('should return the error in the result', () => {
        const app = 1;
        const lang = 'EN';
        const isPreview = true;
        const expectResult = {
          'code': 'CB_NO02',
          'id': '7sqH5vh2McTqtFz0o0LB',
          'message': 'No privilege to proceed.'
        };
        nock('https://' + common.DOMAIN)
          .get('/k/v1/preview/app/form/fields.json', (rqBody) => {
            expect(rqBody.app).toEqual(app);
            expect(rqBody.lang).toEqual(lang);
            expect(rqBody.isPreview).toBeFalsy();
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

        const getFormFieldsResult = recordModule.getFormFields(app, lang, isPreview);
        return getFormFieldsResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('using API token authentication', () => {
      it('should return error when using API token authentication ', () => {
        const expectResult = {
          'code': 'GAIA_NO01',
          'id': 'lzQPJ1hkW3Aj4iVebWCG',
          'message': 'Using this API token, you cannot run the specified API.'
        };
        nock('https://' + common.DOMAIN)
          .get('/k/v1/app/form/fields.json')
          .reply(403, expectResult);
        const getFormFieldsResult = recordModule.getFormFields(10);
        return getFormFieldsResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
  });
});