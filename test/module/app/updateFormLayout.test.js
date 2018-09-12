
/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require('nock');

const common = require('../../../test/utils/common');

const {Connection, Auth, App, KintoneException} = require(common.MAIN_PATH);

const URI = 'https://' + common.DOMAIN;
const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

const appModule = new App(conn);

describe('updateFormLayout function', () => {
  describe('common function', () => {
    const app = 1;
    it('should return promise', () => {
      nock(URI)
        .put('/k/v1/preview/app/form/layout.json')
        .reply(200, {});

      const getAppResult = appModule.updateFormLayout(app);
      expect(getAppResult).toHaveProperty('then');
      expect(getAppResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid request', () => {
      it('[Form-64] should return the app formfield base on full data', () => {
        const data = {
          app: 1,
          'layout': [
            {
              'type': 'ROW',
              'fields': [
                {
                  'type': 'SINGLE_LINE_TEXT',
                  'code': 'Text__single_line_',
                  'size': {
                    'width': '200'
                  }
                }
              ]

            }],
          revision: 1
        };
        const expectResult = {
          'revision': '2'
        };
        nock(URI)
          .put('/k/v1/preview/app/form/layout.json', (rqBody) => {
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

        const updateFormLayoutResult = appModule.updateFormLayout(data.app, data.layout, data.revision);
        return updateFormLayoutResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Valid data - Without revision - Layout type is SUBTABLE', () => {
      it('[Form-65] should return the app formfield base on full data', () => {
        const data = {
          app: 1,
          'layout': [
            {
              'type': 'SUBTABLE',
              'code': 'Table_1',
              'fields': [
                {
                  'type': 'NUMBER',
                  'code': 'Number',
                  'size': {
                    'width': '193'
                  }
                }
              ]
            }],
        };
        const expectResult = {
          'revision': '2'
        };
        nock(URI)
          .put('/k/v1/preview/app/form/layout.json', (rqBody) => {
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

        const updateFormLayoutResult = appModule.updateFormLayout(data.app, data.layout, data.revision);
        return updateFormLayoutResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Guest space - Layout type is GROUP', () => {
      it('[Form-66] should return the app formfield base on full data', () => {
        const data = {
          app: 1,
          'layout': [
            {
              'type': 'GROUP',
              'code': 'Table_1',
              'fields': [
                {
                  'type': 'NUMBER',
                  'code': 'Number',
                  'size': {
                    'width': '193'
                  }
                }
              ]
            }],
        };
        const expectResult = {
          'revision': '2'
        };
        nock(URI)
          .put('/k/guest/1/v1/preview/app/form/layout.json', (rqBody) => {
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
        const updateFormLayoutResult = guestappModule.updateFormLayout(data.app, data.layout, data.revision);
        return updateFormLayoutResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Valid data - Ignore revision -1', () => {
      it('[Form-67] should return the app formfield base on full data', () => {
        const data = {
          app: 1,
          'layout': [
            {
              'type': 'SUBTABLE',
              'code': 'Table_1',
              'fields': [
                {
                  'type': 'NUMBER',
                  'code': 'Number',
                  'size': {
                    'width': '193'
                  }
                }
              ]
            }],
          revision: -1,
        };
        const expectResult = {
          'revision': '2'
        };
        nock(URI)
          .put('/k/v1/preview/app/form/layout.json', (rqBody) => {
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

        const updateFormLayoutResult = appModule.updateFormLayout(data.app, data.layout, data.revision);
        return updateFormLayoutResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify the app deploy status is still displayed when executing with ID as string type', () => {
      it('[Form-68] should return the app formfield base on full data', () => {
        const data = {
          app: '1',
          'layout': [
            {
              'type': 'SUBTABLE',
              'code': 'Table_1',
              'fields': [
                {
                  'type': 'NUMBER',
                  'code': 'Number',
                  'size': {
                    'width': '193'
                  }
                }
              ]
            }],
          revision: -1,
        };
        const expectResult = {
          'revision': '2'
        };
        nock(URI)
          .put('/k/v1/preview/app/form/layout.json', (rqBody) => {
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

        const updateFormLayoutResult = appModule.updateFormLayout(data.app, data.layout, data.revision);
        return updateFormLayoutResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
  });

  describe('error case', () => {
    describe('using API token authentication', () => {
      it('[Form-63] should return error when using API token authentication ', () => {
        const expectResult = {
          'code': 'GAIA_NO01',
          'id': 'lzQPJ1hkW3Aj4iVebWCG',
          'message': 'Using this API token, you cannot run the specified API.'
        };
        nock(URI)
          .put('/k/v1/preview/app/form/layout.json')
          .reply(520, expectResult);
        const updateFormLayoutResult = appModule.updateFormLayout(10);
        return updateFormLayoutResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will be displayed when using method without app ID', () => {
      it('[Form-69] should return error in the result', () => {
        const data = {
          'layout': [
            {
              'type': 'ROW',
              'code': 'Table_1',
              'fields': [
                {
                  'type': 'NUMBER',
                  'code': 'Number',
                  'size': {
                    'width': '193'
                  }
                }
              ]
            }],
          revision: -1,
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'XlKuXMLqfuuGTIu1sMMb',
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
          .put('/k/v1/preview/app/form/layout.json', (rqBody) => {
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

        const updateFormLayoutResult = appModule.updateFormLayout('', data.layout, data.revision);
        return updateFormLayoutResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will be displayed when using method without layout properties', () => {
      it('[Form-70] should return error in the result', () => {
        const data = {
          app: 1,
          revision: -1,
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': '6n4pZsaWBss1whZ7Er6e',
          'message': 'Missing or invalid input.',
          'errors': {
            'layout': {
              'messages': [
                'Required field.'
              ]
            }
          }
        };
        nock(URI)
          .put('/k/v1/preview/app/form/layout.json', (rqBody) => {
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

        const updateFormLayoutResult = appModule.updateFormLayout(data.app, '', data.revision);
        return updateFormLayoutResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will be displayed when using invalid app ID', () => {
      it('[Form-71] should return error in the result', () => {
        const data = {
          app: 'abc',
          'layout': [
            {
              'type': 'ROW',
              'code': 'Table_1',
              'fields': [
                {
                  'type': 'NUMBER',
                  'code': 'Number',
                  'size': {
                    'width': '193'
                  }
                }
              ]
            }],
          revision: -1,
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'cr1NIhQ9s0pvH2njb06T',
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
          .put('/k/v1/preview/app/form/layout.json', (rqBody) => {
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

        const updateFormLayoutResult = appModule.updateFormLayout(data.app, data.layout, data.revision);
        return updateFormLayoutResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will display when user input invalid layout type', () => {
      it('[Form-72] should return error in the result', () => {
        const data = {
          app: 1,
          'layout': [
            {
              'type': 'ERROR',
              'code': 'Table_1',
              'fields': [
                {
                  'type': 'NUMBER',
                  'code': 'Number',
                  'size': {
                    'width': '193'
                  }
                }
              ]
            }],
          revision: -1,
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'hWyBQFXg4R6npZcpoe9D',
          'message': 'Missing or invalid input.',
          'errors': {
            'layout[0].type': {
              'messages': [
                'must be one of the enum value'
              ]
            }
          }
        };
        nock(URI)
          .put('/k/v1/preview/app/form/layout.json', (rqBody) => {
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

        const updateFormLayoutResult = appModule.updateFormLayout(data.app, data.layout, data.revision);
        return updateFormLayoutResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will display when user input invalid fields code', () => {
      it('[Form-73] should return error in the result', () => {
        const data = {
          app: 1,
          'layout': [
            {
              'type': 'ROW',
              'code': 'Table_100000',
              'fields': [
                {
                  'type': 'NUMBER',
                  'code': 'Number',
                  'size': {
                    'width': '193'
                  }
                }
              ]
            }],
          revision: -1,
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'bDmr1SKg9WleHV0YXfAS',
          'message': 'Missing or invalid input.',
          'errors': {
            'layout[0].fields[0].code': {
              'messages': [
                'Failed to update form. Field (code: Table_100000) is not found.'
              ]
            }
          }
        };
        nock(URI)
          .put('/k/v1/preview/app/form/layout.json', (rqBody) => {
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

        const updateFormLayoutResult = appModule.updateFormLayout(data.app, data.layout, data.revision);
        return updateFormLayoutResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error will display when user input invalid fields type', () => {
      it('[Form-74] should return error in the result', () => {
        const data = {
          app: 1,
          'layout': [
            {
              'type': 'ROW',
              'code': 'Table_1',
              'fields': [
                {
                  'type': 'ERROR',
                  'code': 'Number',
                  'size': {
                    'width': '193'
                  }
                }
              ]
            }],
          revision: -1,
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'yHGgueLTOwlwIgNsQyuY',
          'message': 'Missing or invalid input.',
          'errors': {
            'layout[0].fields[0].type': {
              'messages': [
                'must be one of the enum value'
              ]
            }
          }
        };
        nock(URI)
          .put('/k/v1/preview/app/form/layout.json', (rqBody) => {
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

        const updateFormLayoutResult = appModule.updateFormLayout(data.app, data.layout, data.revision);
        return updateFormLayoutResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    describe('Verify error is displayed when input invalid revision', () => {
      it('[Form-75] should return error in the result', () => {
        const data = {
          app: 1,
          'layout': [
            {
              'type': 'ROW',
              'code': 'Table_100000',
              'fields': [
                {
                  'type': 'NUMBER',
                  'code': 'Number',
                  'size': {
                    'width': '193'
                  }
                }
              ]
            }],
          revision: 'abc',
        };
        const expectResult = {
          'code': 'CB_VA01',
          'id': 'oWb81zOypzdEVLCCRZc7',
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
          .put('/k/v1/preview/app/form/layout.json', (rqBody) => {
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

        const updateFormLayoutResult = appModule.updateFormLayout(data.app, data.layout, data.revision);
        return updateFormLayoutResult.catch((err) => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
  });
});
