'use strict'
//VERIFICA QUE EXISTA TOKEN Y QUE EL MISMO ESTE VIGENTE
const jwt = require('jwt-simple');
const moment = require('moment');
const key = 'VentasOnLine';

exports.ensureAuth = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(500).send({mensaje: 'La peticion no tiene token'})
    }
    var token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        var payload = jwt.encode(token, key)
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({mensaje: 'El token ha expirado'})
        }
    } catch (error) {
        return res.status(404).send({mensaje: 'El token no es valido'})
    }
    req.usuario = payload;
    next();
}