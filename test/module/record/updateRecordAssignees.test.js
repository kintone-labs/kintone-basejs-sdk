
/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require('nock');

const common = require('../../utils/common');

const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const Record = require('../../../src/module/record/Record');

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);
const recordModule = new Record(conn);

describe('UpdateRecordAssignees function', () => {
  describe('common case', () => {
    const data = {
      app: 1,
      id: 1,
      assignees: ['user1'],
      revision: 2
    };

    it('should return a promise', () => {
      nock('https://' + common.DOMAIN)
        .put('/k/v1/record/assignees.json')
        .reply(200, {'revision': '3'});
      const updateRecordAssigneesResult = recordModule.updateRecordAssignees(data.app, data.appID, data.assignees, data.revision);
      expect(updateRecordAssigneesResult).toHaveProperty('then');
      expect(updateRecordAssigneesResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid data', () => {
      it('should update successfully the assignee of the record', () => {
        const data = {
          app: 1,
          id: 1,
          assignees: ['user1'],
          revision: 2
        };

        const expectResult = {'revision': '3'};

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/assignees.json', (rqBody) => {
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
        const updateRecordAssigneesResult = recordModule.updateRecordAssignees(data.app, data.id, data.assignees, data.revision);
        return updateRecordAssigneesResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('The assignees of the record are updated successfully', () => {
      it('should update successfully the assignee of the record', () => {
        const data = {
          app: 1,
          id: 1,
          assignees: ['user1', 'user3', 'user4'],
          revision: 2
        };

        const expectResult = {'revision': '3'};

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/assignees.json', (rqBody) => {
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
        const updateRecordAssigneesResult = recordModule.updateRecordAssignees(data.app, data.id, data.assignees, data.revision);
        return updateRecordAssigneesResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('Only 1 assignee when adding duplicate assignees for 1 record', () => {
      it('should update successfully the assignee of the record', () => {
        const data = {
          app: 1,
          id: 1,
          assignees: ['user1', 'user1'],
          revision: 2
        };

        const expectResult = {'revision': '3'};

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/assignees.json', (rqBody) => {
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
        const updateRecordAssigneesResult = recordModule.updateRecordAssignees(data.app, data.id, data.assignees, data.revision);
        return updateRecordAssigneesResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('Verify it is able to add 100 assignees for the record', () => {
      it('should update successfully the assignee of the record', () => {
        const number = 100;
        const data = {
          app: 1,
          id: 1,
          assignee: 'user6',
          revision: 2
        };

        const expectResult = {'revision': '3'};

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/assignees.json', (rqBody) => {
            expect(rqBody.app).toEqual(data.app);
            expect(rqBody.assignees).toMatchObject(common.generateRecord(number, data.assignee));
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
        const updateAssignees = recordModule.updateRecordAssignees(data.app, data.id, common.generateRecord(number, data.assignee), data.revision);
        return updateAssignees.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('The record is added successfully for app in guest space', () => {
      it('should update successfully the assignee of the record', () => {
        const data = {
          app: 1,
          id: 1,
          assignees: ['user1'],
          revision: 2
        };

        const expectResult = {'revision': '3'};

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/assignees.json', (rqBody) => {
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
        const recordAssignee = new Record(conn1);
        const updateRecordAssigneesResult = recordAssignee.updateRecordAssignees(data.app, data.id, data.assignees, data.revision);
        return updateRecordAssigneesResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('The function still work correctly when executing with interger as string type', () => {
      it('should update successfully the assignee of the record', () => {
        const data = {
          app: '1',
          id: '1',
          assignees: ['user1', 'user3', 'user4'],
          revision: 2
        };

        const expectResult = {'revision': '3'};

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/assignees.json', (rqBody) => {
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
        const updateRecordAssigneesResult = recordModule.updateRecordAssignees(data.app, data.id, data.assignees, data.revision);
        return updateRecordAssigneesResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
  });

  describe('Error case', () => {
    describe('Error is displayed when changing status with multiple assignee for Complete/Not Start status', () => {
      it('should return the error in the result', () => {
        const data = {
          app: 1,
          id: 1,
          assignees: ['user1', 'user2'],
          revision: 2
        };

        const expectResult = {
          'code': 'GAIA_TO02',
          'id': 'nLO8Tjp9dRmIRkHclTFj',
          'message': 'Only one assignee can be set to "Completed".'
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/assignees.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(Buffer.from(common.USERNAME + ':' + common.PASSWORD).toString('base64'));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(502, expectResult);

        const updateRecordAssigneesResult = recordModule.updateRecordAssignees(data.app, data.id, data.assignees, data.revision);
        return updateRecordAssigneesResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('The error is displayed when adding more than 100 assignees', () => {
      it('should return the error in the result', () => {
        const number = 105;
        const data = {
          app: 1,
          id: 1,
          assignee: 'user1',
          revision: 2
        };

        const expectResult = {
          'code': 'CB_VA01',
          'id': 'w2gU8q13XMtVmYHZRe8K',
          'message': 'Missing or invalid input.',
          'errors': {
            'assignees': {
              'messages': [
                'size must be between 0 and 100'
              ]
            }
          }
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/assignees.json', (rqBody) => {
            expect(rqBody.app).toEqual(data.app);
            expect(rqBody.assignees).toMatchObject(common.generateRecord(number, data.assignee));
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
        const updateAssignees = recordModule.updateRecordAssignees(data.app, data.id, common.generateRecord(number, data.assignee), data.revision);
        return updateAssignees.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('Errror is displayed when the revision is not correct', () => {
      it('should return the error in the result', () => {
        const data = {
          app: 1,
          id: 1,
          assignees: ['user1', 'user2'],
          revision: 2
        };

        const expectResult = {
          'id': '8NHtbwNLY3RFK99etdW0',
          'code': 'GAIA_CO02',
          'message': 'The revision is not the latest. Someone may update a record.',
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/assignees.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(Buffer.from(common.USERNAME + ':' + common.PASSWORD).toString('base64'));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(400, expectResult);

        const updateRecordAssigneesResult = recordModule.updateRecordAssignees(data.app, data.id, data.assignees, data.revision);
        return updateRecordAssigneesResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('Errror happens when adding wrong/unexisted assignee for 1 record', () => {
      it('should return the error in the result', () => {
        const data = {
          app: 1,
          id: 1,
          assignees: ['user_notexist'],
          revision: 2
        };

        const expectResult = {
          'code': 'GAIA_IL26',
          'id': 'XCqDduel9hphcC8T3jxv',
          'message': 'The specified user (code：user_notexist) not found.'
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/assignees.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(Buffer.from(common.USERNAME + ':' + common.PASSWORD).toString('base64'));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(520, expectResult);

        const updateRecordAssigneesResult = recordModule.updateRecordAssignees(data.app, data.id, data.assignees, data.revision);
        return updateRecordAssigneesResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('The error will be displayed when using invalid app ID', () => {
      it('should return the error in the result', () => {
        const data = {
          app: 'abc',
          id: 1,
          assignees: ['user1', 'user2'],
          revision: 2
        };

        const expectResult = {
          'code': 'CB_VA01',
          'id': 'nFhw4mcY6M8m8F0dOMfR',
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
          .put('/k/v1/record/assignees.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(Buffer.from(common.USERNAME + ':' + common.PASSWORD).toString('base64'));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(400, expectResult);

        const updateRecordAssigneesResult = recordModule.updateRecordAssignees(data.app, data.id, data.assignees, data.revision);
        return updateRecordAssigneesResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('The error will be displayed when using method without app ID', () => {
      it('should return the error in the result', () => {
        const data = {
          id: 1,
          assignees: ['user1'],
          revision: 2
        };

        const expectResult = {
          'code': 'CB_VA01',
          'id': 'iN6cXz14UBJ0LLTCGczG',
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
          .put('/k/v1/record/assignees.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(Buffer.from(common.USERNAME + ':' + common.PASSWORD).toString('base64'));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(400, expectResult);

        const updateRecordAssigneesResult = recordModule.updateRecordAssignees('', data.id, data.assignees, data.revision);
        return updateRecordAssigneesResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('Error happens when user does not have Edit permission for app/record/fields', () => {
      it('should return the error in the result', () => {
        const data = {
          app: 2,
          id: 2,
          assignees: ['user2'],
          revision: 3
        };

        const expectResult = {
          'code': 'CB_NO02',
          'id': 'BU2JLXsaYblJJCgsAiLj',
          'message': 'No privilege to proceed.'
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/assignees.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(Buffer.from(common.USERNAME + ':' + common.PASSWORD).toString('base64'));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(400, expectResult);

        const updateRecordAssigneesResult = recordModule.updateRecordAssignees(data.app, data.id, data.assignees, data.revision);
        return updateRecordAssigneesResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('Error happens when API token does not have Manage App permission', () => {
      it('should return the error in the result', () => {
        const data = {
          app: 2,
          id: 2,
          assignees: ['user2'],
          revision: 3
        };

        const expectResult = {
          'code': 'CB_NO02',
          'id': 'BU2JLXsaYblJJCgsAiLj',
          'message': 'No privilege to proceed.'
        };

        const authAPI = new Auth();
        authAPI.setApiToken(common.API_TOKEN);

        const conn1 = new Connection(common.DOMAIN, authAPI);
        const recordAssignee = new Record(conn1);
        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/assignees.json')
          .matchHeader(common.API_TOKEN, (authHeader) => {
            expect(authHeader).toEqual(common.API_TOKEN);
            return true;
          })
          .reply(403, expectResult);

        const updateRecordAssigneesResult = recordAssignee.updateRecordAssignees(data.app, data.id, data.assignees, data.revision);
        return updateRecordAssigneesResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('The error will be displayed when using method without record ID', () => {
      it('should return the error in the result', () => {
        const data = {
          app: 1,
          assignees: ['user1'],
          revision: 2
        };

        const expectResult = {
          'code': 'CB_VA01',
          'id': '2RrRnAjsbSSmMCbbDdFP',
          'message': 'Missing or invalid input.',
          'errors': {
            'id': {
              'messages': [
                'Required field.'
              ]
            }
          }
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/assignees.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(Buffer.from(common.USERNAME + ':' + common.PASSWORD).toString('base64'));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(400, expectResult);

        const updateRecordAssigneesResult = recordModule.updateRecordAssignees(data.app, '', data.assignees, data.revision);
        return updateRecordAssigneesResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('The error will be displayed when using method without assignee', () => {
      it('should return the error in the result', () => {
        const data = {
          app: 1,
          id: 1,
          revision: 2
        };

        const expectResult = {
          'code': 'CB_VA01',
          'id': '2RrRnAjsbSSmMCbbDdFP',
          'message': 'Missing or invalid input.',
          'errors': {
            'assignees': {
              'messages': [
                'Required field.'
              ]
            }
          }
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/assignees.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(Buffer.from(common.USERNAME + ':' + common.PASSWORD).toString('base64'));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(400, expectResult);

        const updateRecordAssigneesResult = recordModule.updateRecordAssignees(data.app, data.id, '', data.revision);
        return updateRecordAssigneesResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('The error will be displayed when the process management featured is disabled', () => {
      it('should return the error in the result', () => {
        const data = {
          app: '1',
          id: '1',
          assignees: ['user1'],
          revision: 3
        };

        const expectResult = {revision: '15'};

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/assignees.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
            expect(authHeader).toBe(Buffer.from(common.USERNAME + ':' + common.PASSWORD).toString('base64'));
            return true;
          })
          .matchHeader('Content-Type', (type) => {
            expect(type).toBe('application/json');
            return true;
          })
          .reply(200, expectResult);

        const updateRecordAssigneesResult = recordModule.updateRecordAssignees(data.app, data.id, data.assignees, data.revision);
        return updateRecordAssigneesResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('Invalid id', () => {
      it('should return error when using unexist record id', () => {
        const data = {
          app: 1,
          id: 22,
          assignees: ['user1'],
          revision: 2
        };

        const expectResult = {'code': 'GAIA_RE01', 'id': '8PePOAQMHkWHWeynRPjQ', 'message': 'The specified record (ID: 22) is not found.'};

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/assignees.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .reply(404, expectResult);
        const updateRecordAssigneesResult = recordModule.updateRecordAssignees(data.app, data.id, data.assignees, data.revision);
        return updateRecordAssigneesResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
  });
});