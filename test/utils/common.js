module.exports = {
  PASSWORD_AUTH: 'X-Cybozu-Authorization',
  API_TOKEN: 'X-Cybozu-API-Token',
  DOMAIN: 'sample.cybozu.com',
  USERNAME: 'cybozu',
  PASSWORD: 'cybozu',
  PROXY_HOST: 'your_proxy',
  PROXY_PORT: '3128',
  GUEST_SPACEID: 1,
  MAIN_PATH: '../../../src/main',
  getPasswordAuth: (userName, password) => {
    return Buffer.from(userName + ':' + password).toString('base64');
  },
  generateRecord: (number, inputRecord) => {
    const items = [];
    for (let i = 0; i < number; i++) {
      items.push(inputRecord);
    }
    return items;
  }
};

