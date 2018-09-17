
const nock = require('nock');

const common = require('../../utils/common');

const Connection = require('../../../src/connection/Connection');
const CONNECTION_CONST = require('../../../src/connection/constant');

const Auth = require('../../../src/authentication/Auth');

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);

const conn = new Connection(common.DOMAIN, auth);
describe('Connection module', () => {
  describe('common function', () => {
    it('should return a connection when "addRequestOption" function is called', () => {
      expect(conn.addRequestOption()).toBeInstanceOf(Connection);
    });

    it('should return a connection when "setProxy" function is called', () => {
      expect(conn.setProxy(common.PROXY_HOST, common.PROXY_PORT)).toBeInstanceOf(Connection);
    });

    it('should return a connection when "setHeader" function is called', () => {
      expect(conn.setHeader('json', true)).toBeInstanceOf(Connection);
    });

    it('should return a connection when "setAuth" function is called', () => {
      expect(conn.setAuth(auth)).toBeInstanceOf(Connection);
    });
    it('should throw a Error when "setAuth" function with input param that is\'nt Auth is called', () => {
      expect(() => {
        conn.setAuth();
      }).toThrow();
    });

    const expectURI = `${CONNECTION_CONST.BASE.SCHEMA}://${common.DOMAIN}:443/k/v1/record.json`;
    it(`should return "${expectURI}" when using "getUri('record')" from nomal space`, () => {
      expect(conn.getUri('record')).toEqual(expectURI);
    });

    const guestSpaceID = 1;
    const uri = `${CONNECTION_CONST.BASE.SCHEMA}://${common.DOMAIN}:443/k/guest/${guestSpaceID}/v1/record.json`;

    const connWithSpace = new Connection(common.DOMAIN, auth, guestSpaceID);
    it(`should return "${uri}" when using "getUri('record')" from guest space`, () => {
      expect(connWithSpace.getUri('record')).toEqual(uri);
    });


    it('should return a promisse when "request" function is called', () => {
      expect(conn.request('GET', '/page-not-found')).toHaveProperty('then');
      expect(conn.request('GET', '/page-not-found')).toHaveProperty('catch');
    });
  });

  describe('proxy function', () => {
    it(`should set proxy to request when using setProxy function`, () => {
      nock(`https://${common.DOMAIN}`)
        .get(`/k/v1/get?app=1`)
        .reply(400, {});

      conn.setProxy(common.PROXY_HOST, common.PROXY_PORT);
      const response = conn.request('GET', '/k/v1/test', {app: 1});
      const expectProxy = {
        host: common.PROXY_HOST,
        port: common.PROXY_PORT
      };
      return response.catch((err) => {
        expect(err.config.httpsAgent.options.proxy).toMatchObject(expectProxy);
      });
    });
  });

  describe('request function', () => {
    it('should send successfully the request', () => {
      const body = {
        app: 1
      };

      nock('https://' + common.DOMAIN)
        .get(`/k/v1/records.json?app=${body.app}`)
        .matchHeader(common.PASSWORD_AUTH, (authHeader) => {
          expect(authHeader).toBe(Buffer.from(common.USERNAME + ':' + common.PASSWORD).toString('base64'));
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

      const connn = new Connection(common.DOMAIN, auth);
      connn.setHeader('test', 'test');
      const request = connn.request('GET', 'RECORDS', body);
      request.then((rsp)=> {
        expect(rsp).toHaveProperty('records');
      });
    });
  });
});