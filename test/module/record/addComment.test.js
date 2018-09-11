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
const recordModule = new Record(conn);

const URI = "https://" + common.DOMAIN;
const ROUTE = "/k/v1/record/comment.json";

describe("addComment function", () => {
  describe("common case", () => {
    it("should return a promise", () => {
      nock(URI)
        .post(ROUTE)
        .reply(200, { id: "1" });
      let addCommentResult = recordModule.addComment();
      expect(addCommentResult).toHaveProperty("then");
      expect(addCommentResult).toHaveProperty("catch");
    });
  });

  describe("success cases", () => {
    it("[RecordModule-236] should add comment to record successfully", () => {
      const data = {
        app: 1,
        record: 1,
        comment: {
          text: "hello"
        }
      };

      nock(URI)
        .post(ROUTE, reqBody => {
          expect(reqBody).toMatchObject(data);
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
        .reply(200, { id: "1" });

      let actualResult = recordModule.addComment(
        data.app,
        data.record,
        data.comment
      );
      return actualResult.then(rsp => {
        expect(rsp).toHaveProperty("id");
      });
    });

    it("[RecordModule-237] should add a comment with the content containing special characters", () => {
      let data = {
        app: 1,
        record: 2,
        comment: { text: "new comment containing 日本" }
      };
      let expectedResult = { id: "5" };
      nock(URI)
        .post(ROUTE, reqBody => {
          expect(reqBody).toHaveProperty("comment");
          return true;
        })
        .reply(200, expectedResult);

      let actualResult = recordModule.addComment(
        data.app,
        data.record,
        data.comment
      );
      return actualResult.then(response => {
        expect(response).toMatchObject(expectedResult);
      });
    });

    it("[RecordModule-239] should add a comment with mention", () => {
      let data = {
        app: 1,
        record: 2,
        comment: {
          text: "new comment containing 日本",
          mentions: [
            {
              code: "user16",
              type: "USER"
            },
            {
              code: "Global Sales_1BNZeQ",
              type: "ORGANIZATION"
            },
            {
              code: "APAC Taskforce_DJrvzu",
              type: "GROUP"
            }
          ]
        }
      };
      let expectedResult = { id: "5" };
      nock(URI)
        .post(ROUTE, reqBody => {
          expect(reqBody).toHaveProperty("comment");
          expect(reqBody.comment).toHaveProperty("mentions");
          return true;
        })
        .reply(200, expectedResult);

      let actualResult = recordModule.addComment(
        data.app,
        data.record,
        data.comment
      );
      return actualResult.then(response => {
        expect(response).toMatchObject(expectedResult);
      });
    });

    it("[RecordModule-252] should add a comment successfully when inputting string for appId", () => {
      let data = {
        app: 1,
        record: 2,
        comment: { text: "something goes here" }
      };
      let expectedResult = { id: "8" };
      nock(URI)
        .post(ROUTE, reqBody => {
          expect(reqBody).toHaveProperty("app");
          expect(reqBody).toHaveProperty("record");
          expect(reqBody).toHaveProperty("comment");
          return true;
        })
        .reply(200, expectedResult);

      let actualResult = recordModule.addComment(
        data.app,
        data.record,
        data.comment
      );
      return actualResult.then(response => {
        expect(response).toMatchObject(expectedResult);
      });
    });
  });

  describe("error case", () => {
    describe("invalid comment content", () => {
      it("[RecordModule-241] should return error when the comment text is blank", () => {
        let data = {
          app: 1,
          record: 1,
          comment: {
            text: ""
          }
        };
        let expectResult = {
          code: "CB_VA01",
          id: "7oiYHOZd11fTpyvY00kG",
          message: "Missing or invalid input.",
          errors: {
            "comment.text": {
              messages: [
                "Enter between 1 and 65,535 characters.",
                "Required field."
              ]
            }
          }
        };
        nock(URI)
          .post(ROUTE, reqBody => {
            expect(reqBody).toMatchObject(data);
            return true;
          })
          .reply(400, expectResult);

        let actualResult = recordModule.addComment(
          data.app,
          data.record,
          data.comment
        );
        return actualResult.catch(err => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });

    // it("[RecordModule-242] should return an error when specifying an unexisted user in mention", () => {
    //   const data = {
    //     app: 1,
    //     record: 2,
    //     comment: {
    //       text: "something goes here",
    //       mention: [
    //         {
    //           code: "un-existed",
    //           type: "USER"
    //         }
    //       ]
    //     }
    //   };
    //   const expectedResult = {
    //     code: "CB_VA01",
    //     id: "7oiYHOZd11fTpyvY00kG",
    //     message: "Missing or invalid input.",
    //     errors: {
    //       "comment.text": {
    //         messages: [
    //           "Enter between 1 and 65,535 characters.",
    //           "Required field."
    //         ]
    //       }
    //     }
    //   };
    //   nock(URI)
    //     .post(ROUTE, reqBody => {
    //       expect(reqBody).toHaveProperty("comment");
    //       expect(reqBody.comment).toHaveProperty("mention");
    //       return true;
    //     })
    //     .reply(400, expectedResult);
    //   const actualResult = recordModule.addComment(
    //     data.app,
    //     data.record,
    //     data.comment
    //   );
    //   return actualResult.catch(err => {
    //     expect(err).toBeInstanceOf(KintoneException);
    //     expect(err.get()).toMatchObject(expectedResult);
    //   });
    // });

    it("[RecordModule-246] should return an error when using invalid appId", () => {
      let data = {
        app: -1,
        record: 2,
        comment: { text: "something goes here" }
      };
      let expectedResult = {
        code: "CB_VA01",
        id: "R4E6puJFh6nDPXypT796",
        message: "入力内容が正しくありません。",
        errors: {
          app: {
            messages: ["最小でも1以上です。"]
          }
        }
      };
      nock(URI)
        .post(ROUTE, reqBody => {
          expect(reqBody.app).toBeLessThan(0);
          return true;
        })
        .reply(400, expectedResult);
      let actualResult = recordModule.addComment(
        data.app,
        data.record,
        data.comment
      );
      return actualResult.catch(err => {
        expect(err).toBeInstanceOf(KintoneException);
        expect(err.get()).toMatchObject(expectedResult);
      });
    });

    it("[RecordModule-247] should return an error when using invalid recordId", () => {
      let data = {
        app: 1,
        record: -2,
        comment: { text: "something goes here" }
      };
      let expectedResult = {
        code: "CB_VA01",
        id: "MDx5kAIOfK4AbeJssEYW",
        message: "入力内容が正しくありません。",
        errors: {
          record: {
            messages: ["最小でも1以上です。"]
          }
        }
      };
      nock(URI)
        .post(ROUTE, reqBody => {
          expect(reqBody.record).toBeLessThan(0);
          return true;
        })
        .reply(400, expectedResult);
      let actualResult = recordModule.addComment(
        data.app,
        data.record,
        data.comment
      );
      return actualResult.catch(err => {
        expect(err).toBeInstanceOf(KintoneException);
        expect(err.get()).toMatchObject(expectedResult);
      });
    });

    it("[RecordModule-248] should return an error when missing appId", () => {
      let data = {
        app: undefined,
        record: 2,
        comment: { text: "something goes here" }
      };
      let expectedResult = {
        code: "CB_VA01",
        id: "9JAS954ZZpOZk7PcZ3JS",
        message: "入力内容が正しくありません。",
        errors: {
          app: {
            messages: ["必須です。"]
          }
        }
      };
      nock(URI)
        .post(ROUTE, reqBody => {
          expect(reqBody).not.toHaveProperty("app");
          return true;
        })
        .reply(400, expectedResult);

      let actualResult = recordModule.addComment(
        data.app,
        data.record,
        data.comment
      );
      return actualResult.catch(err => {
        expect(err).toBeInstanceOf(KintoneException);
      });
    });

    it("[RecordModule-249] should return an error when missing recordId", () => {
      let data = {
        app: 1,
        record: undefined,
        comment: { text: "something goes here" }
      };
      let expectedResult = {
        code: "CB_VA01",
        id: "jxdkEErN6fBh5Uip6qik",
        message: "入力内容が正しくありません。",
        errors: {
          record: {
            messages: ["必須です。"]
          }
        }
      };
      nock(URI)
        .post(ROUTE, reqBody => {
          expect(reqBody).not.toHaveProperty("record");
          return true;
        })
        .reply(400, expectedResult);

      let actualResult = recordModule.addComment(
        data.app,
        data.record,
        data.comment
      );
      return actualResult.catch(err => {
        expect(err).toBeInstanceOf(KintoneException);
      });
    });

    it("[RecordModule-250] should return an error when missing comment", () => {
      let data = {
        app: 1,
        record: undefined,
        comment: undefined
      };
      let expectedResult = {
        code: "CB_VA01",
        id: "GCUZnHDYCC6bvKjOSgoB",
        message: "入力内容が正しくありません。",
        errors: {
          comment: {
            messages: ["必須です。"]
          }
        }
      };
      nock(URI)
        .post(ROUTE, reqBody => {
          expect(reqBody).not.toHaveProperty("comment");
          return true;
        })
        .reply(400, expectedResult);

      let actualResult = recordModule.addComment(
        data.app,
        data.record,
        data.comment
      );
      return actualResult.catch(err => {
        expect(err).toBeInstanceOf(KintoneException);
      });
    });
  });
});
