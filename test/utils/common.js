module.exports = {
  PASSWORD_AUTH: 'X-Cybozu-Authorization',
  API_TOKEN: 'X-Cybozu-API-Token',
  DOMAIN: 'sample.cybozu.com',
  USERNAME: 'your_username',
  PASSWORD: 'your_password',
  PROXY_HOST: 'your_proxy',
  PROXY_PORT: '3128',
<<<<<<< HEAD:test/utils/common.js
  GUEST_SPACEID: 1,
  MAIN_PATH: '../../../src/main',
=======
  GUEST_SPACEID: 'your_guest_space_ID',
>>>>>>> v0.1.6_unit_test:test/common.js
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

