/**
 * kintone api - nodejs client
 */

const KintoneErrorResponseModel = require('../model/exception/ErrorResponse');
const KintoneAPIExceptionModel =
    require('../model/exception/KintoneAPIException');

const error = new WeakMap();
const errorRaw = new WeakMap();
/**
 * kintone Exception Module
 */
class KintoneAPIException {
  /**
     * The constructor ofc  KintoneAPIException functions
     * @param {Error} errors
     */
  constructor(errors) {
    let errorResponse;
    errorRaw.set(this, errors);
    if (!errors.hasOwnProperty('response') || !errors.response) {
      errorResponse = new KintoneErrorResponseModel(0, null, errors.message, errors);
    } else {
      errorResponse = this.getErrorResponse(errors.response.data);

      if (Buffer.isBuffer(errors.response.data)) {
        const stringError = errors.response.data.toString();
        errorResponse = this.getErrorResponse(JSON.parse(stringError));
      }
    }
    if (!(errorResponse instanceof KintoneErrorResponseModel)) {
      errorResponse = new KintoneErrorResponseModel(0, null, errors.response.statusMessage, errorResponse);
    }
    const statusCode = errors.response ? (errors.response.statusCode || 0) : 0;
    error.set(this, new KintoneAPIExceptionModel(statusCode, errorResponse));
  }
  /**
     * get origin errors
     * @return {Error}
     */
  getAll() {
    return errorRaw.get(this);
  }
  /**
     * Show origin error
     */
  throwAll() {
    throw this.getAll();
  }
  /**
     * Show Error
     * @return {Error}
     */
  get() {
    return error.get(this).getErrorResponse().toJSON();
  }
  /**
     * Show Error
     */
  throw() {
    throw new Error(`
            HttpErrorCode: ${error.get(this).getHttpErrorCode()}
            Details:'
                + ID: ${error.get(this).getErrorResponse().getID() || '(none)'}
                + Code:' ${error.get(this)
    .getErrorResponse().getCode() || '(none)'}
                + Message: ${error.get(this).getErrorResponse()
    .getMessage() || '(none)'}
                + Errors: ` + (JSON.stringify(
      error.get(this).getErrorResponse().getErrors() || '(none)')));
  }
  /**
     * getErrorResponse
     * @param {String} bodyResponse
     * @return {KintoneErrorResponseModel}
     */
  getErrorResponse(bodyResponse) {
    let response = null;
    if (typeof bodyResponse === 'object') {
      response = bodyResponse;
    } else {
      // Validate isJSON
      try {
        response = JSON.parse(bodyResponse);
      } catch (error) {}
    }
    // Detect the error response from bulkrequest.
    // if (response !== null && response.hasOwnProperty('results')) {
    //     for (let index = 0; index < response.results.length; index++) {
    //         if (response.results[index].hasOwnProperty('code')) {
    //             response = response.results[index];
    //             break;
    //         }
    //     }
    // }
    return response && response.id ? new KintoneErrorResponseModel(
      response.id,
      response.code,
      response.message,
      response.errors) : response;
  }
}

module.exports = KintoneAPIException;
