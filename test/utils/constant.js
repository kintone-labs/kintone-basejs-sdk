/**
 * Constants
 */
const COMMON = require('./common.js');

const API_ROUTE = {
  RECORD: `k/v1/record.json`,
  GUEST_RECORD: `k/guest/${COMMON.GUEST_SPACEID}/v1/record.json`,
};

module.exports = {API_ROUTE};
