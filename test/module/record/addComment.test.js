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

const auth = new Auth();
auth.setPasswordAuth(common.USERNAME, common.PASSWORD);
const conn = new Connection(common.DOMAIN, auth);
const recordModule = new Record(conn);

const URI = "https://" + common.DOMAIN;
const ROUTE = "/k/v1/record/comment.json";

describe("addComment function", () => {
  describe("common case", () => {
    it("should return a promise", () => {
      nock("https://" + common.DOMAIN)
        .post("/k/v1/record/comment.json")
        .reply(200, { id: "1" });
      //const recordModule = new Record(conn);
      const addCommentResult = recordModule.addComment();
      expect(addCommentResult).toHaveProperty("then");
      expect(addCommentResult).toHaveProperty("catch");
    });
  });

  describe("success case", () => {
    it("should add comment to record successfully", () => {
      const data = {
        app: 1,
        record: 1,
        comment: {
          text: "hello"
        }
      };

      nock("https://" + common.DOMAIN)
        .post("/k/v1/record/comment.json", rqBody => {
          expect(rqBody).toMatchObject(data);
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

      //const recordModule = new Record(conn);
      const addCommentResult = recordModule.addComment(
        data.app,
        data.record,
        data.comment
      );
      return addCommentResult.then(rsp => {
        expect(rsp).toHaveProperty("id");
      });
    });

    it("[RecordModule-237] should add a comment with the content containing special characters", () => {
      const data = {
        app: 1,
        record: 2,
        comment: { text: "new comment containing 日本" }
      };
      const expectedResult = { id: "5" };
      nock(URI)
        .post(ROUTE, reqBody => {
          expect(reqBody).toHaveProperty("comment");
          return true;
        })
        .reply(200, expectedResult);

      const actualResult = recordModule.addComment(
        data.app,
        data.record,
        data.comment
      );
      return actualResult.then(response => {
        expect(response).toMatchObject(expectedResult);
      });
    });

    it("[RecordModule-239] should add a comment with mention", () => {
      const data = {
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
      const expectedResult = { id: "5" };
      nock(URI)
        .post(ROUTE, reqBody => {
          expect(reqBody).toHaveProperty("comment");
          expect(reqBody.comment).toHaveProperty("mentions");
          return true;
        })
        .reply(200, expectedResult);

      const actualResult = recordModule.addComment(
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
      it("should return error when the comment text is blank", () => {
        const data = {
          app: 1,
          record: 1,
          comment: {
            text: ""
          }
        };
        const expectResult = {
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
        nock("https://" + common.DOMAIN)
          .post("/k/v1/record/comment.json", rqBody => {
            expect(rqBody).toMatchObject(data);
            return true;
          })
          .reply(400, expectResult);

        //const recordModule = new Record(conn);
        const addCommentResult = recordModule.addComment(
          data.app,
          data.record,
          data.comment
        );
        return addCommentResult.catch(err => {
          expect(err).toBeInstanceOf(KintoneException);
          expect(err.get()).toMatchObject(expectResult);
        });
      });
    });
    /**
     * Todo: implement more case
     */
  });
});
