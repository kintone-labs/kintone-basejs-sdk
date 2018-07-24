/**
 * kintone api - nodejs client
 */

const httpErrorCode = new WeakMap();
const errorResponse = new WeakMap();

/**
 * KintoneAPIException model
 */
class KintoneAPIException {
  /**
     * @param {String} httpErrCode
     * @param {ErrorResponse} errorResponseInput
     */
  constructor(httpErrCode, errorResponseInput) {
    httpErrorCode.set(this, httpErrCode);
    errorResponse.set(this, errorResponseInput);
  }
  /**
     * @return {string}
     */
  getHttpErrorCode() {
    return httpErrorCode.get(this);
  }
  /**
     * @return {ErrorResponse}
     */
  getErrorResponse() {
    return errorResponse.get(this);
  }
}
module.exports = KintoneAPIException;
