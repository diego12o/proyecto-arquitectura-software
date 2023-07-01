const sha1 = require("sha-1");
const enc = (str) => {
  let pw;
  for (let index = 0; index < 23; index++) {
    pw = sha1(pw);
  }
  return pw;
};
module.exports = {
  enc,
};
