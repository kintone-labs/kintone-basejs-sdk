/**
 * kintone api - nodejs client
 * test record module
 */
const nock = require("nock");
const common = require("../../common");
const {
  KintoneException,
  Connection,
  Auth,
  Record
} = require("../../../src/main");

const auth = new Auth().setPasswordAuth(common.USERNAME, common.PASSWORD);
const conn = new Connection(common.DOMAIN, auth);
if (common.hasOwnProperty("proxy") && common.proxy) {
  conn.addRequestOption("proxy", common.proxy);
}
const recordModule = new Record(conn);
const URI = "https://" + common.DOMAIN;
const ROUTE = "/k/v1/record/comments.json";

describe("getComments function", () => {
  describe("common cases", () => {
    it("should return a promise", () => {
      let data = {
        app: 1,
        record: 2
      };
      nock(URI)
        .get(ROUTE)
        .reply(200, {
          comments: [
            {
              id: "2",
              text:
                "user13 Global Sales APAC Taskforce \nHere is today's report.",
              createdAt: "2016-05-09T18:27:54Z",
              creator: {
                code: "user14",
                name: "user14"
              }
            }
          ],
          older: false,
          newer: false
        });
      let actualResult = recordModule.getComments(data.app, data.record);
      expect(actualResult).toHaveProperty("then");
      expect(actualResult).toHaveProperty("catch");
    });
  });

  describe("success cases", () => {
    describe("valid data, app + record only", () => {
      it("[RecordModule-215] should return correctly the comments of record,", () => {
        let data = {
          app: 1,
          record: 2
        };

        nock(URI)
          .get(ROUTE, reqBody => {
            expect(reqBody.app).toEqual(data.app);
            expect(reqBody.record).toEqual(data.record);
            return true;
          })
          .matchHeader("X-Cybozu-Authorization", authHeader => {
            expect(authHeader).toBe(
              common.getPasswordAuth(common.USERNAME, common.PASSWORD)
            );
            return true;
          })
          .matchHeader("Content-Type", type => {
            expect(type).toBe("application/json");
            return true;
          })
          .reply(200, {
            comments: [
              {
                id: "2",
                text:
                  "user13 Global Sales APAC Taskforce \nHere is today's report.",
                createdAt: "2016-05-09T18:27:54Z",
                creator: {
                  code: "user14",
                  name: "user14"
                }
              }
            ],
            older: false,
            newer: false
          });
        let actualResult = recordModule.getComments(data.app, data.record);
        return actualResult.then(response => {
          expect(response).toHaveProperty("comments");
        });
      });

      it("[RecordModule-216] should return the comments of record by the order of `asc`", () => {
        let data = { app: 1, record: 2 };
        let expectedResult = {
          comments: [
            {
              id: "1",
              text: "asd",
              createdAt: "2018-09-07T07:47:07Z",
              creator: {
                code: "cybozu",
                name: "cybozu"
              },
              mentions: []
            },
            {
              id: "2",
              text: "bnm",
              createdAt: "2018-09-07T07:47:14Z",
              creator: {
                code: "cybozu",
                name: "cybozu"
              },
              mentions: []
            },
            {
              id: "3",
              text: "qwe",
              createdAt: "2018-09-07T07:49:27Z",
              creator: {
                code: "cybozu",
                name: "cybozu"
              },
              mentions: []
            },
            {
              id: "4",
              text: "cvb",
              createdAt: "2018-09-07T07:49:37Z",
              creator: {
                code: "cybozu",
                name: "cybozu"
              },
              mentions: []
            }
          ],
          older: false,
          newer: false
        };
        nock(URI)
          .get(ROUTE, reqBody => {
            expect(reqBody.order).toBe("asc");
            return true;
          })
          .reply(200, expectedResult);

        let actualResult = recordModule.getComments(
          data.app,
          data.record,
          "asc",
          undefined,
          undefined
        );
        return actualResult.then(response => {
          expect(response).toHaveProperty("comments");
          expect(response).toMatchObject(expectedResult);
        });
      });

      it("[RecordModule-217] should return the comments of record by the order of `desc`", () => {
        let data = { app: 1, record: 2 };
        let expectedResult = {
          comments: [
            {
              id: "4",
              text: "cvb",
              createdAt: "2018-09-07T07:49:37Z",
              creator: {
                code: "cybozu",
                name: "cybozu"
              },
              mentions: []
            },
            {
              id: "3",
              text: "qwe",
              createdAt: "2018-09-07T07:49:27Z",
              creator: {
                code: "cybozu",
                name: "cybozu"
              },
              mentions: []
            },
            {
              id: "2",
              text: "bnm",
              createdAt: "2018-09-07T07:47:14Z",
              creator: {
                code: "cybozu",
                name: "cybozu"
              },
              mentions: []
            },
            {
              id: "1",
              text: "asd",
              createdAt: "2018-09-07T07:47:07Z",
              creator: {
                code: "cybozu",
                name: "cybozu"
              },
              mentions: []
            }
          ],
          older: false,
          newer: false
        };
        nock(URI)
          .get(ROUTE, reqBody => {
            expect(reqBody.order).toBe("desc");
            return true;
          })
          .reply(200, expectedResult);

        let actualResult = recordModule.getComments(
          data.app,
          data.record,
          "desc",
          undefined,
          undefined
        );
        return actualResult.then(response => {
          expect(response).toHaveProperty("comments");
          expect(response).toMatchObject(expectedResult);
        });
      });

      it("[RecordModule-219] should return the comments of record according to the offset value", () => {
        let data = { app: 1, record: 2 };
        let expectedResult = {
          comments: [
            {
              id: "3",
              text: "qwe",
              createdAt: "2018-09-07T07:49:27Z",
              creator: {
                code: "cybozu",
                name: "cybozu"
              },
              mentions: []
            },
            {
              id: "4",
              text: "cvb",
              createdAt: "2018-09-07T07:49:37Z",
              creator: {
                code: "cybozu",
                name: "cybozu"
              },
              mentions: []
            }
          ],
          older: true,
          newer: false
        };
        let OFFSET = 2;

        nock(URI)
          .get(ROUTE, reqBody => {
            expect(reqBody.offset).toEqual(OFFSET);
            return true;
          })
          .reply(200, expectedResult);

        let actualResult = recordModule.getComments(
          data.app,
          data.record,
          "asc",
          OFFSET,
          undefined
        );
        return actualResult.then(response => {
          expect(response).toHaveProperty("comments");
          expect(response).toMatchObject(expectedResult);
        });
      });

      it("[RecordModule-220] should return the comments of record without skipping when the offset value is 0", () => {
        let data = { app: 1, record: 2 };
        let expectedResult = {
          comments: [
            {
              id: "4",
              text: "cvb",
              createdAt: "2018-09-07T07:49:37Z",
              creator: {
                code: "cybozu",
                name: "cybozu"
              },
              mentions: []
            },
            {
              id: "3",
              text: "qwe",
              createdAt: "2018-09-07T07:49:27Z",
              creator: {
                code: "cybozu",
                name: "cybozu"
              },
              mentions: []
            },
            {
              id: "2",
              text: "bnm",
              createdAt: "2018-09-07T07:47:14Z",
              creator: {
                code: "cybozu",
                name: "cybozu"
              },
              mentions: []
            },
            {
              id: "1",
              text: "asd",
              createdAt: "2018-09-07T07:47:07Z",
              creator: {
                code: "cybozu",
                name: "cybozu"
              },
              mentions: []
            }
          ],
          older: false,
          newer: false
        };
        let OFFSET = 0;

        nock(URI)
          .get(ROUTE, reqBody => {
            expect(reqBody.offset).toEqual(OFFSET);
            return true;
          })
          .reply(200, expectedResult);

        let actualResult = recordModule.getComments(
          data.app,
          data.record,
          "desc",
          OFFSET,
          undefined
        );
        return actualResult.then(response => {
          expect(response).toHaveProperty("comments");
          expect(response).toMatchObject(expectedResult);
        });
      });

      it("[RecordModule-222] should return the comments of record according to the limit value", () => {
        let data = { app: 1, record: 2 };
        let expectedResult = {
          comments: [
            {
              id: "4",
              text: "cvb",
              createdAt: "2018-09-07T07:49:37Z",
              creator: {
                code: "cybozu",
                name: "cybozu"
              },
              mentions: []
            },
            {
              id: "3",
              text: "qwe",
              createdAt: "2018-09-07T07:49:27Z",
              creator: {
                code: "cybozu",
                name: "cybozu"
              },
              mentions: []
            }
          ],
          older: true,
          newer: false
        };
        let LIMIT = 2;

        nock(URI)
          .get(ROUTE, reqBody => {
            expect(reqBody.limit).toEqual(LIMIT);
            return true;
          })
          .reply(200, expectedResult);

        let actualResult = recordModule.getComments(
          data.app,
          data.record,
          undefined,
          undefined,
          LIMIT
        );
        return actualResult.then(response => {
          expect(response).toHaveProperty("comments");
          expect(response).toMatchObject(expectedResult);
        });
      });

      it("[RecordModule-223] should NOT return the comments of record when the limit value is 0", () => {
        let data = { app: 1, record: 2 };
        let expectedResult = {
          comments: [],
          older: true,
          newer: false
        };
        let LIMIT = 0;
        nock(URI)
          .get(ROUTE, reqBody => {
            expect(reqBody.limit).toEqual(LIMIT);
            return true;
          })
          .reply(200, expectedResult);

        let actualResult = recordModule.getComments(
          data.app,
          data.record,
          undefined,
          undefined,
          LIMIT
        );
        return actualResult.then(response => {
          expect(response).toHaveProperty("comments");
          expect(response).toMatchObject(expectedResult);
        });
      });
    });

    describe("combination of order + offset + limit", () => {
      it("[RecordModule-225] should return the comments of record when combining the three param {order, offset, limit}", () => {
        let data = { app: 1, record: 2, order: "desc", offset: 3, limit: 3 };
        let expectedResult = {
          comments: [
            {
              id: "1",
              text: "asd",
              createdAt: "2018-09-07T07:47:07Z",
              creator: {
                code: "cybozu",
                name: "cybozu"
              },
              mentions: []
            }
          ],
          older: false,
          newer: true
        };

        nock(URI)
          .get(ROUTE, reqBody => {
            expect(reqBody.order).toBe(data.order);
            expect(reqBody.offset).toEqual(data.offset);
            expect(reqBody.limit).toEqual(data.limit);
            return true;
          })
          .reply(200, expectedResult);
        let actualResult = recordModule.getComments(
          data.app,
          data.record,
          data.order,
          data.offset,
          data.limit
        );
        return actualResult.then(response => {
          expect(response).toHaveProperty("comments");
          expect(response).toMatchObject(expectedResult);
        });
      });
    });
  });

  describe("error case", () => {
    it("[RecordModule-218] should return an error when the value of order is invalid", () => {
      let data = {
        app: 2,
        record: 1,
        order: "dd"
      };

      nock(URI)
        .get(ROUTE, reqBody => {
          expect(reqBody.order).toEqual(data.order);
          return true;
        })
        .reply(400, {
          code: "CB_VA01",
          id: "Z8rWaqS8S8x8zfqoVLyt",
          message: "入力内容が正しくありません。",
          errors: {
            order: { messages: ["Enum値のいずれかでなければなりません。"] }
          }
        });
      let actualResult = recordModule.getComments(
        data.app,
        data.record,
        data.order
      );
      return actualResult.catch(err => {
        expect(err).toBeInstanceOf(KintoneException);
      });
    });

    it("[RecordModule-221] should return an error when the value of offset is invalid", () => {
      let data = { app: 1, record: 2 };
      let OFFSET = -1;
      let expectedResult = {
        code: "CB_VA01",
        id: "N0t3WAWaUpYycmdwqdDK",
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

      let actualResult = recordModule.getComments(
        data.app,
        data.record,
        undefined,
        OFFSET,
        undefined
      );
      return actualResult.catch(err => {
        expect(err).toBeInstanceOf(KintoneException);
      });
    });

    it("[RecordModule-224] should return an error when the value of limit is greater than 10", () => {
      let data = { app: 1, record: 2 };
      let LIMIT = 11;
      let expectedResult = {
        code: "CB_VA01",
        id: "GK7azPfLL3wV1Jq2GvUH",
        message: "入力内容が正しくありません。",
        errors: {
          limit: {
            messages: ["最大でも10以下です。"]
          }
        }
      };
      nock(URI)
        .get(ROUTE, reqBody => {
          expect(reqBody.limit).toBeGreaterThan(10);
          return true;
        })
        .reply(400, expectedResult);

      let actualResult = recordModule.getComments(
        data.app,
        data.record,
        undefined,
        undefined,
        LIMIT
      );
      return actualResult.catch(err => {
        expect(err).toBeInstanceOf(KintoneException);
      });
    });

    it("[RecordModule-230] should return an error when using invalid appId", () => {
      let data = { app: -1, record: 2 };
      let expectedResult = {
        code: "CB_VA01",
        id: "7IAqt2O3hm4Fw1oui0bn",
        message: "入力内容が正しくありません。",
        errors: {
          app: {
            messages: ["最小でも1以上です。"]
          }
        }
      };
      nock(URI)
        .get(ROUTE, reqBody => {
          expect(reqBody.app).toBeLessThan(0);
          return true;
        })
        .reply(400, expectedResult);

      let actualResult = recordModule.getComments(
        data.app,
        data.record,
        undefined,
        undefined,
        undefined
      );
      return actualResult.catch(err => {
        expect(err).toBeInstanceOf(KintoneException);
        expect(err.get()).toMatchObject(expectedResult);
      });
    });

    it("[RecordModule-231] should return an error when using invalid recordId", () => {
      let data = { app: 1, record: -2 };
      let expectedResult = {
        code: "CB_VA01",
        id: "4KCVyFaCn4JTEEhw6ozb",
        message: "入力内容が正しくありません。",
        errors: {
          record: {
            messages: ["最小でも1以上です。"]
          }
        }
      };
      nock(URI)
        .get(ROUTE, reqBody => {
          expect(reqBody.record).toBeLessThan(0);
          return true;
        })
        .reply(400, expectedResult);

      let actualResult = recordModule.getComments(
        data.app,
        data.record,
        undefined,
        undefined,
        undefined
      );
      return actualResult.catch(err => {
        expect(err).toBeInstanceOf(KintoneException);
        expect(err.get()).toMatchObject(expectedResult);
      });
    });

    it("[RecordModule-232] should return an error when missing appId", () => {
      let data = { app: 1, record: 2 };
      let expectedResult = {
        code: "CB_VA01",
        id: "fPvGX7iqoF0DxeCI04Pk",
        message: "入力内容が正しくありません。",
        errors: {
          app: {
            messages: ["必須です。"]
          }
        }
      };
      nock(URI)
        .get(ROUTE, reqBody => {
          expect(reqBody).not.toHaveProperty("app");
          return true;
        })
        .reply(400, expectedResult);

      let actualResult = recordModule.getComments(
        undefined,
        data.record,
        undefined,
        undefined,
        undefined
      );
      return actualResult.catch(err => {
        expect(err).toBeInstanceOf(KintoneException);
        expect(err.get()).toMatchObject(expectedResult);
      });
    });

    it("[RecordModule-233] should return an error when missing recordId", () => {
      let data = { app: 1, record: 2 };
      let expectedResult = {
        code: "CB_VA01",
        id: "DUB0DXXSrnORvhKeC4mz",
        message: "入力内容が正しくありません。",
        errors: {
          record: {
            messages: ["必須です。"]
          }
        }
      };
      nock(URI)
        .get(ROUTE, reqBody => {
          expect(reqBody).not.toHaveProperty("record");
          return true;
        })
        .reply(400, expectedResult);

      let actualResult = recordModule.getComments(
        data.app,
        undefined,
        undefined,
        undefined,
        undefined
      );
      return actualResult.catch(err => {
        expect(err).toBeInstanceOf(KintoneException);
        expect(err.get()).toMatchObject(expectedResult);
      });
    });
  });
});
