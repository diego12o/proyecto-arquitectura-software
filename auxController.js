const sha1 = require('sha-1');



const enc = (str) => {

    var pw = sha1(str);
    for (let index = 2; index < 23; index++) {
        pw = sha1(pw);
        
    }
    console.log(pw);
    return pw;
}

module.exports = {
    enc
}

