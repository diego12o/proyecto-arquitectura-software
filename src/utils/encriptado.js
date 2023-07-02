const sha1 = require("sha-1");
const enc = (str) => {
  let pw = str;
  for (let index = 0; index < 23; index++) {
    pw = sha1(pw);
  }
  return pw;
};
module.exports = {
  enc,
};
