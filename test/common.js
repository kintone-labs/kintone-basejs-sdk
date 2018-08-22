module.exports = {
  PASSWORD_AUTH: 'X-Cybozu-Authorization',
  API_TOKEN: 'X-Cybozu-API-Token',
  getPasswordAuth: (userName, password) => {
    return Buffer.from(userName + ':' + password).toString('base64');
  }
};

