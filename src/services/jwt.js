'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const key = 'VentasOnLine';

exports.createToken = function (usuario) {
    var payload = {
        id: usuario._id,
        nombre: usuario._id,
        iat: moment().unix(),
        exp: moment().day(30, 'days').unix()
    }
    return jwt.encode(payload, key);
}