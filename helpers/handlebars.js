const { publicEncrypt, privateDecrypt } = require("crypto");

module.exports = {
  ifEquals: (arg1, arg2) => {
    return arg1 == arg2 ? true : false;
  },
  publicEncrypt: publicEncrypt,
  privateDecrypt: privateDecrypt,
};
