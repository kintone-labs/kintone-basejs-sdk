
const nock = require('nock');

const config = require('../../config');
const common = require('../../common');

const Connection = require('../../../src/connection/Connection');
const CONNECTION_CONST = require('../../../src/connection/constant');

const Auth = require('../../../src/authentication/Auth');

const auth = new Auth();
auth.setPasswordAuth(config.username, config.password);

const conn = new Connection(config.domain, auth);
describe('Connection module', () => {
  describe('common function', () => {
    it('should return a connection when "addRequestOption" function is called', () => {
      expect(conn.addRequestOption()).toBeInstanceOf(Connection);
    });

    it('should return a connection when "setProxy" function is called', () => {
      expect(conn.setProxy(config.proxyHost, config.proxyPost)).toBeInstanceOf(Connection);
    });

    it('should return a connection when "setHeader" function is called', () => {
      expect(conn.setHeader()).toBeInstanceOf(Connection);
    });

    it('should return a connection when "setAuth" function is called', () => {
      expect(conn.setAuth(auth)).toBeInstanceOf(Connection);
    });
    it('should throw a Error when "setAuth" function with input param that is\'nt Auth is called', () => {
      expect(() => {
        conn.setAuth();
      }).toThrow();
    });

    const expectURI = `${CONNECTION_CONST.BASE.SCHEMA}://${config.domain}/k/v1/record.json`;
    it(`should return "${expectURI}" when using "getUri('record')" from nomal space`, () => {
      expect(conn.getUri('record')).toEqual(expectURI);
    });

    const uri = `${CONNECTION_CONST.BASE.SCHEMA}://${config.domain}` +
              `/k/guest/${config.guestSpaceID}` +
              `/v1/record.json`;

    const guestSpaceID = 1;
    const connWithSpace = new Connection(config.domain, auth, guestSpaceID);
    it(`should return "${uri}" when using "getUri('record')" from guest space`, () => {
      expect(connWithSpace.getUri('record')).toEqual(uri);
    });


    it('should return a promisse when "request" function is called', () => {
      expect(conn.request('GET', '/page-not-found')).toHaveProperty('then');
      expect(conn.request('GET', '/page-not-found')).toHaveProperty('catch');
    });

    conn.setProxy(config.proxyHost, config.proxyPost);
    const response = conn.request('GET', '/page-not-found');
    const expectProxy = 'http://' + config.proxyHost + ':' + config.proxyPost;
    it(`should set '${expectProxy}' proxy to request when using setProxy function`, () => {
      return response.catch((err) => {
        expect(err.options.proxy).toBe(expectProxy);
      });
    });
  });

  describe('request function', () => {
    it('should send successfully the request', () => {
      const body = {
        app: 1
      };

      nock('https://' + config.domain)
        .get(`/k/v1/records.json`, (rqbody) => {
          expect(rqbody.app).toBe(body.app);
          return true;
        })
        .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
          expect(authHeader).toBe(Buffer.from(config.username + ':' + config.password).toString('base64'));
          return true;
        })
        .matchHeader('test', (authHeader) => {
          expect(authHeader).toBe('test');
          return true;
        })
        .matchHeader('Content-Type', (type) => {
          expect(type).toBe('application/json');
          return true;
        })
        .reply(200, {
          'records': [{}]});

      const connn = new Connection(config.domain, auth);
      connn.addRequestOption('json', true);
      connn.setHeader('test', 'test');
      const request = connn.request('GET', 'RECORDS', body);
      request.then((rsp)=> {
        expect(rsp).toHaveProperty('records');
      });
    });
  });
});