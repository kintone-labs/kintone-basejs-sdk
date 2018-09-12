
/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require('nock');

const common = require('../../common');

const Connection = require('../../../src/connection/Connection');
const Auth = require('../../../src/authentication/Auth');
const Record = require('../../../src/module/record/Record');

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);

describe('updateRecordStatus function', () => {
  describe('common case', () => {
    const data = {
      app: 1,
      id: 1,
      action: 'Submit',
      assignee: 'user1',
      revision: 2
    };

    it('should return a promise', () => {
      nock('https://' + common.DOMAIN)
        .put('/k/v1/record/status.json')
        .reply(200, {'revision': '3'});

      const recordModule = new Record(conn);
      const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, data.appID, data.action, data.assignee, data.revision);
      expect(updateRecordStatusResult).toHaveProperty('then');
      expect(updateRecordStatusResult).toHaveProperty('catch');
    });
  });

  describe('success case', () => {
    describe('Valid data - Status and Assignee', () => {
      it('should changed successfully the status of the record', () => {
        const data = {
          app: 1,
          id: 1,
          action: 'Submit',
          assignee: 'user1',
          revision: 2
        };

        const expectResult = {'revision': '3'};

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/status.json', (rqBody) => {
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

        const recordModule = new Record(conn);
        const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, data.id, data.action, data.assignee, data.revision);
        return updateRecordStatusResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('Valid data - Status only - Verify the status is changed correctly', () => {
      it('should changed successfully the status of the record', () => {
        const data = {
          app: 2,
          id: 2,
          action: 'Completed',
          revision: 3
        };

        const expectResult = {'revision': '4'};

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/status.json', (rqBody) => {
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

        const recordModule = new Record(conn);
        const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, data.id, data.action, '', data.revision);
        return updateRecordStatusResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('Verify the localized status is changed correctly (EN/JP/ZH) when the localization feature is enabled', () => {
      it('should changed successfully the status of the record', () => {
        const data = {
          app: 1,
          id: 1,
          action: 'スタート',
          revision: 2
        };

        const expectResult = {'revision': '3'};

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/status.json', (rqBody) => {
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

        const recordModule = new Record(conn);
        const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, data.id, data.action, '', data.revision);
        return updateRecordStatusResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('Ignore the revision and the status is updated correctly', () => {
      it('should changed successfully the status of the record', () => {
        const data = {
          app: 1,
          id: 1,
          action: 'Submit',
          revision: -1
        };

        const expectResult = {'revision': '3'};

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/status.json', (rqBody) => {
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

        const recordModule = new Record(conn);
        const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, data.id, data.action, '', data.revision);
        return updateRecordStatusResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('The record is added successfully for app in Guest Space', () => {
      it('should changed successfully the status of the record', () => {
        const data = {
          app: 1,
          id: 1,
          action: 'Submit',
          assignee: 'user1',
          revision: 2
        };

        const expectResult = {'revision': '3'};

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/status.json', (rqBody) => {
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
        const recordStatus = new Record(conn1);
        const updateRecordStatusResult = recordStatus.updateRecordStatus(data.app, data.id, data.action, data.assignee, data.revision);
        return updateRecordStatusResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('Verify "User chooses one assignee from the list to take action" is not set, user can change status without providing assignee', () => {
      it('should changed successfully the status of the record', () => {
        const data = {
          app: 1,
          id: 1,
          action: 'Submit',
          revision: 2
        };

        const expectResult = {'revision': '3'};

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/status.json', (rqBody) => {
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

        const recordModule = new Record(conn);
        const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, data.id, data.action, '', data.revision);
        return updateRecordStatusResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('The status is changed correctly when the current user is the Assignee of the record', () => {
      it('should changed successfully the status of the record', () => {
        const data = {
          app: 1,
          id: 1,
          action: 'Submit',
          assignee: 'user2',
          revision: -1
        };

        const expectResult = {'revision': '3'};

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/status.json', (rqBody) => {
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

        const recordModule = new Record(conn);
        const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, data.id, data.action, data.assignee, data.revision);
        return updateRecordStatusResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    describe('The function still work correctly when executing with interger as string type', () => {
      it('should changed successfully the status of the record', () => {
        const data = {
          app: '1',
          id: '1',
          action: 'Submit',
          assignee: 'user1',
          revision: 2
        };

        const expectResult = {'revision': '3'};

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/status.json', (rqBody) => {
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

        const recordModule = new Record(conn);
        const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, data.id, data.action, data.assignee, data.revision);
        return updateRecordStatusResult.then((rsp) => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });
  });

  describe('error case', () => {
    describe('Verify "User chooses one assignee from the list to take action" is set, error displayed when change status without assignee', () => {
      it('should return the error in the result', () => {
        const data = {
          app: 1,
          id: 1,
          action: 'Start',
          revision: 2
        };

        const expectResult = {
          'code': 'GAIA_SA01',
          'id': 'r564zRh5fJGmtEpjwPbN',
          'message': 'Assignee is required.'
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/status.json', (rqBody) => {
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

        const recordModule = new Record(conn);
        const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, data.id, data.action, '', data.revision);
        return updateRecordStatusResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('Error is displayed when changing status with assignee for Complete/Not Start status', () => {
      it('should return the error in the result', () => {
        const data = {
          app: 1,
          id: 1,
          action: 'Start',
          assignee: 'user1',
          revision: 2
        };

        const expectResult = {
          'code': 'GAIA_SA04',
          'id': 'de8MGDsxTZI4VNqn73eo',
          'message': 'Failed to update status. Assignee cannot be specified by the action.'
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/status.json', (rqBody) => {
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
          .reply(520, expectResult);

        const recordModule = new Record(conn);
        const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, data.id, data.action, data.assignee, data.revision);
        return updateRecordStatusResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('Errror is displayed when the status is not correct', () => {
      it('should return the error in the result', () => {
        const data = {
          app: 1,
          id: 1,
          action: 'Error_status',
          assignee: 'user1',
          revision: 2
        };

        const expectResult = {
          'code': 'GAIA_IL03',
          'id': '91V2E4UIkuDwngsE6lcq',
          'message': 'Failed to update the status. The settings or the status itself may have been changed by someone.'
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/status.json', (rqBody) => {
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

        const recordModule = new Record(conn);
        const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, data.id, data.action, data.assignee, data.revision);
        return updateRecordStatusResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('Errror happens when adding invalid/unexisted assignee for 1 record', () => {
      it('should return the error in the result', () => {
        const data = {
          app: 1,
          id: 1,
          action: 'Start',
          assignee: 'unexist_user',
          revision: 2
        };

        const expectResult = {
          'code': 'GAIA_IL26',
          'id': 'TXtbWfmtL3vpCffesUzH',
          'message': 'The specified user (code：unexist_user) not found.'
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/status.json', (rqBody) => {
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
          .reply(520, expectResult);

        const recordModule = new Record(conn);
        const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, data.id, data.action, data.assignee, data.revision);
        return updateRecordStatusResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('Error is displayed when the revision is not correct', () => {
      it('should return the error in the result', () => {
        const data = {
          app: 1,
          id: 1,
          action: 'Start',
          assignee: 'user1',
          revision: 'abc'
        };

        const expectResult = {
          'code': 'CB_VA01',
          'id': 'sRXKNwyq9vSkZlddzsl1',
          'message': 'Missing or invalid input.',
          'errors': {
            'revision': {
              'messages': [
                'Enter an integer value.'
              ]
            }
          }
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/status.json', (rqBody) => {
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

        const recordModule = new Record(conn);
        const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, data.id, data.action, data.assignee, data.revision);
        return updateRecordStatusResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('Error is displayed when changing status with the record that already has Assignee', () => {
      it('should return the error in the result', () => {
        const data = {
          app: 1,
          id: 1,
          action: 'Submit',
          assignee: 'user1',
          revision: -1
        };

        const expectResult = {
          'code': 'GAIA_NT01',
          'id': 'YysgGE3vcpRU4G9ZQyvA',
          'message': 'Only Assignee can change the status.'
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/status.json', (rqBody) => {
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

        const recordModule = new Record(conn);
        const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, data.id, data.action, data.assignee, data.revision);
        return updateRecordStatusResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('The error will be displayed when using invalid app ID', () => {
      it('should return the error in the result', () => {
        const data = {
          app: 100000,
          id: 1,
          action: 'Submit',
          assignee: 'user1',
          revision: -1
        };

        const expectResult = {
          'code': 'GAIA_AP01',
          'id': 'odSa5TDi8wU7UlpGfck3',
          'message': 'The app (ID: 100000) not found. The app may have been deleted.'
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/status.json', (rqBody) => {
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

        const recordModule = new Record(conn);
        const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, data.id, data.action, data.assignee, data.revision);
        return updateRecordStatusResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('The error will be displayed when using method without app ID', () => {
      it('should return the error in the result', () => {
        const data = {
          id: 1,
          action: 'Submit',
          assignee: 'user1',
          revision: -1
        };

        const expectResult = {
          'code': 'CB_VA01',
          'id': 'tdTAK2tvpfssOCADPUwR',
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
          .put('/k/v1/record/status.json', (rqBody) => {
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

        const recordModule = new Record(conn);
        const updateRecordStatusResult = recordModule.updateRecordStatus('', data.id, data.action, data.assignee, data.revision);
        return updateRecordStatusResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('The error will be displayed when using method without record ID', () => {
      it('should return the error in the result', () => {
        const data = {
          app: 1,
          action: 'Submit',
          assignee: 'user1',
          revision: -1
        };

        const expectResult = {
          'code': 'CB_VA01',
          'id': 'xQLcu61tMGhM0IQa7zwN',
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
          .put('/k/v1/record/status.json', (rqBody) => {
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

        const recordModule = new Record(conn);
        const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, '', data.action, data.assignee, data.revision);
        return updateRecordStatusResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('The error will be displayed when using method without assignee', () => {
      it('should return the error in the result', () => {
        const data = {
          app: 1,
          action: 'Testing',
          revision: -1
        };

        const expectResult = {
          'code': 'GAIA_SA01',
          'id': 'r564zRh5fJGmtEpjwPbN',
          'message': 'Assignee is required.'
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/status.json', (rqBody) => {
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
          .reply(520, expectResult);

        const recordModule = new Record(conn);
        const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, '', data.action, data.assignee, data.revision);
        return updateRecordStatusResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('The error will be displayed when the process management featured is disabled', () => {
      it('should return the error in the result', () => {
        const data = {
          app: 1,
          id: 1,
          action: 'Submit',
          assignee: 'user1',
          revision: -1
        };

        const expectResult = {
          'code': 'GAIA_ST02',
          'id': 'vrNS6L86jbDgFZAGe5lT',
          'message': 'Your request failed. The process management feature has been disabled.'
        };

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/status.json', (rqBody) => {
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
          .reply(520, expectResult);

        const recordModule = new Record(conn);
        const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, data.id, data.action, data.assignee, data.revision);
        return updateRecordStatusResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    describe('Change status not assignee', () => {
      it('should return error when the login user is not assigned', () => {
        const data = {
          app: 1,
          id: 1,
          action: 'Submit',
          assignee: 'user1',
          revision: 2
        };

        const expectResult = {'code': 'GAIA_NT01', 'id': '4UPEpLZKYpZfju46I3wm', 'message': 'Only Assignee can change the status.'};

        nock('https://' + common.DOMAIN)
          .put('/k/v1/record/status.json', (rqBody) => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .reply(403, expectResult);

        const recordModule = new Record(conn);
        const updateRecordStatusResult = recordModule.updateRecordStatus(data.app, data.id, data.action, data.assignee, data.revision);
        return updateRecordStatusResult.catch((err) => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
  });
});