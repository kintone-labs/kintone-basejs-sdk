class Common {

    getPasswordAuth(userName, password) {
      return Buffer.from(userName + ':' + password).toString('base64');
    }
    /**
     * get unexisted app respone
     * @param {*} unexistedAppID
     */
    getUnexistedAppResp(unexistedAppID) {
      return {
        'code': 'GAIA_AP01',
        'id': 'id when request to invalid app',
        'message': 'The app (ID: ' + unexistedAppID + ') not found. The app may have been deleted.'
      };
    }
  
    /**
     * get missing or invalid input respone
     */
    getMissingOrInvalidInputResp() {
      return {
        'code': 'CB_VA01',
        'id': '0hjc1OJbmY29cl2SoDey',
        'message': 'Missing or invalid input.',
        'errors': {'app':
         {'messages': ['must be greater than or equal to 1']
         }
        }
      };
    }
  
    getWrongRevisonResp() {
      return {'code': 'GAIA_CO02',
        'id': 'MJkW0PkiEJ3HhuPRkl3H',
        'message': '指定したrevisionは最新ではありません。ほかのユーザーがレコードを更新した可能性があります。'};
    }
  }
  module.exports = Common;