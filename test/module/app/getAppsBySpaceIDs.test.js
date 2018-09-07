/**
 * kintone api - nodejs client
 * test app module
 */
const nock = require("nock");
const common = require("../../common");
const { Connection, Auth, App } = require("../../../src/main");
const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);
const conn = new Connection(common.DOMAIN, auth);
const appModule = new App(conn);

const URI = "https://" + common.DOMAIN;
const ROUTE = "/k/v1/apps.json";

describe("getAppsBySpaceIDs function", () => {
  describe("common function", () => {
    it("should return promise", () => {
      const spaceIds = [1];
      nock("https://" + common.DOMAIN)
        .get("/k/v1/apps.json")
        .reply(200, {});

      const getAppResult = appModule.getAppsBySpaceIDs(spaceIds);
      expect(getAppResult).toHaveProperty("then");
      expect(getAppResult).toHaveProperty("catch");
    });
  });

  describe("success common", () => {
    describe("Valid request", () => {
      it("[AppModule-58] should return the app information based on the list of space ID (without limit, offset)", () => {
        const spaceIds = [1];
        const expectResult = {
          apps: [
            {
              appId: "1",
              code: "task",
              name: "My Test App",
              description: "Testing this app",
              spaceId: null,
              threadId: null,
              createdAt: "2014-06-02T05:14:05.000Z",
              creator: {
                code: "user1",
                name: "user1"
              },
              modifiedAt: "2014-06-02T05:14:05.000Z",
              modifier: {
                code: "user1",
                name: "user1"
              }
            }
          ]
        };
        nock("https://" + common.DOMAIN)
          .get("/k/v1/apps.json", rqBody => {
            expect(rqBody.spaceIds).toEqual(spaceIds);
            return true;
          })
          .matchHeader(common.PASSWORD_AUTH, authHeader => {
            expect(authHeader).toBe(
              common.getPasswordAuth(common.USERNAME, common.PASSWORD)
            );
            return true;
          })
          .matchHeader("Content-Type", type => {
            expect(type).toBe("application/json");
            return true;
          })
          .reply(200, expectResult);
        const getAppsBySpaceIDsByIDsResult = appModule.getAppsBySpaceIDs(
          spaceIds
        );
        return getAppsBySpaceIDsByIDsResult.then(rsp => {
          expect(rsp).toMatchObject(expectResult);
        });
      });
    });

    it("[AppModule-59] should return the app information based on the list of spaceIds and the limit", () => {
      const expectedResult = {
        apps: [
          {
            appId: "1",
            code: "task",
            name: "My Test App",
            description: "Testing this app",
            spaceId: null,
            threadId: null,
            createdAt: "2014-06-02T05:14:05.000Z",
            creator: {
              code: "user1",
              name: "user1"
            },
            modifiedAt: "2014-06-02T05:14:05.000Z",
            modifier: {
              code: "user1",
              name: "user1"
            }
          },
          {
            appId: "2",
            code: "task",
            name: "My Test App",
            description: "Testing this app",
            spaceId: null,
            threadId: null,
            createdAt: "2014-06-02T05:14:05.000Z",
            creator: {
              code: "user1",
              name: "user1"
            },
            modifiedAt: "2014-06-02T05:14:05.000Z",
            modifier: {
              code: "user1",
              name: "user1"
            }
          }
        ]
      };

      let limit = 2;
      let spaceIds = [1, 2];
      nock(URI)
        .get(ROUTE, reqBody => {
          expect(reqBody.spaceIds).toEqual(spaceIds);
          expect(reqBody.limit).toEqual(limit);
          return true;
        })
        .reply(200, expectedResult);

      let actualResult = appModule.getAppsBySpaceIDs(
        spaceIds,
        undefined,
        limit
      );
      return actualResult.then(response => {
        expect(response).toMatchObject(expectedResult);
      });
    });

    it("[AppModule-60] should return the app information based on the list of spaceIds and the offset", () => {
      const expectedResult = {
        apps: [
          {
            appId: "1",
            code: "task",
            name: "My Test App",
            description: "Testing this app",
            spaceId: null,
            threadId: null,
            createdAt: "2014-06-02T05:14:05.000Z",
            creator: {
              code: "user1",
              name: "user1"
            },
            modifiedAt: "2014-06-02T05:14:05.000Z",
            modifier: {
              code: "user1",
              name: "user1"
            }
          },
          {
            appId: "3",
            code: "task",
            name: "My Test App",
            description: "Testing this app",
            spaceId: null,
            threadId: null,
            createdAt: "2014-06-02T05:14:05.000Z",
            creator: {
              code: "user1",
              name: "user1"
            },
            modifiedAt: "2014-06-02T05:14:05.000Z",
            modifier: {
              code: "user1",
              name: "user1"
            }
          }
        ]
      };
      let offset = 2;
      let spaceIds = [1, 2, 3];
      nock(URI)
        .get(ROUTE, reqBody => {
          expect(reqBody.spaceIds).toEqual(spaceIds);
          expect(reqBody.offset).toEqual(offset);
          return true;
        })
        .reply(200, expectedResult);

      let actualResult = appModule.getAppsBySpaceIDs(
        spaceIds,
        offset,
        undefined
      );
      return actualResult.then(response => {
        expect(response).toMatchObject(expectedResult);
      });
    });
  });

  describe("error case", () => {
    describe("using API token authentication", () => {
      it("[AppModule-57] should return error when using API token authentication ", () => {
        const expectResult = {
          code: "GAIA_NO01",
          id: "lzQPJ1hkW3Aj4iVebWCG",
          message: "Using this API token, you cannot run the specified API."
        };
        nock("https://" + common.DOMAIN)
          .get("/k/v1/apps.json")
          .reply(403, expectResult);
        const getAppsResult = appModule.getAppsBySpaceIDs([1]);
        return getAppsResult.catch(err => {
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    it("[AppModule-62] should return an error when the param limit has value of 0", () => {
      const expectedResult = {
        code: "CB_VA01",
        id: "DtsFKYOmw2gfIUgOG0Wh",
        message: "入力内容が正しくありません。",
        errors: {
          limit: {
            messages: ["最小でも1以上です。"]
          }
        }
      };
      nock(URI)
        .get(ROUTE, reqBody => {
          expect(reqBody.limit).toEqual(0);
          return true;
        })
        .reply(400, expectedResult);

      let spaceIds = [1, 2, 3];
      let actualResult = appModule.getAppsBySpaceIDs(spaceIds, undefined, 0);
      return actualResult.catch(err => {
        expect(err.get()).toMatchObject(expectedResult);
      });
    });

    it("[AppMoudle-63] should return an error when the param limit has value greater than 100", () => {
      const expectedResult = {
        code: "CB_VA01",
        id: "H6bw2ZEUMUvP6fZSfCJL",
        message: "入力内容が正しくありません。",
        errors: {
          limit: {
            messages: ["最大でも100以下です。"]
          }
        }
      };
      nock(URI)
        .get(ROUTE, reqBody => {
          expect(reqBody.limit).toBeGreaterThan(100);
          return true;
        })
        .reply(400, expectedResult);

      let spaceIds = [1, 2, 3];
      let actualResult = appModule.getAppsBySpaceIDs(spaceIds, undefined, 101);
      return actualResult.catch(err => {
        expect(err.get()).toMatchObject(expectedResult);
      });
    });

    it("[AppModule-64] should return an error when the param offset has value less than 0", () => {
      const expectedResult = {
        code: "CB_VA01",
        id: "v23TyuqDg6QpEYrU7JpX",
        message: "入力内容が正しくありません。",
        errors: {
          offset: {
            messages: ["最小でも0以上です。"]
          }
        }
      };
      nock(URI)
        .get(ROUTE, reqBody => {
          expect(reqBody.offset).toBeLessThan(0);
          return true;
        })
        .reply(400, expectedResult);

      let spaceIds = [1, 2, 3];
      let actualResult = appModule.getAppsBySpaceIDs(spaceIds, -1, undefined);
      return actualResult.catch(err => {
        expect(err.get()).toMatchObject(expectedResult);
      });
    });

    it("[AppModule-74] should return an error when the param offset has value greater than max value 2147483647", () => {
      const MAX_VALUE = 2147483647;
      const expectedResult = {
        code: "CB_VA01",
        id: "RWue1TbVHvtSYABtAg6V",
        message: "入力内容が正しくありません。",
        errors: {
          offset: {
            messages: ["最大でも2,147,483,647以下です。"]
          }
        }
      };
      nock(URI)
        .get(ROUTE, reqBody => {
          expect(reqBody.offset).toBeGreaterThan(MAX_VALUE);
          return true;
        })
        .reply(400, expectedResult);

      let spaceIds = [1, 2, 3];
      let actualResult = appModule.getAppsBySpaceIDs(
        spaceIds,
        MAX_VALUE + 1,
        undefined
      );
      return actualResult.catch(err => {
        expect(err.get()).toMatchObject(expectedResult);
      });
    });

    it("[AppModule-75] should return an error when the param limit has value greater than max value 2147483647", () => {
      const MAX_VALUE = 2147483647;
      const expectedResult = {
        code: "CB_VA01",
        id: "ASeFDvLefehJ5IKyLmBJ",
        message: "入力内容が正しくありません。",
        errors: {
          limit: {
            messages: ["最大でも100以下です。"]
          }
        }
      };

      nock(URI)
        .get(ROUTE, reqBody => {
          expect(reqBody.limit).toBeGreaterThan(MAX_VALUE);
          return true;
        })
        .reply(400, expectedResult);

      let spaceIds = [1, 2, 3];
      let actualResult = appModule.getAppsBySpaceIDs(
        spaceIds,
        undefined,
        MAX_VALUE + 1
      );
      return actualResult.catch(err => {
        expect(err.get()).toMatchObject(expectedResult);
      });
    });
  });
});
