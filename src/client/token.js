const moment = require('moment')
const jwt = require("jsonwebtoken");


const createToken = (iduser) => {
    let payload = {
        userId: iduser,
        createdAt: moment().unix(),
        expiresAt: moment().add(1, "day").unix(),
    };

    return jwt.sign(payload, "Tok3n-4uth-US3R");
};

module.exports = {
    createToken
}