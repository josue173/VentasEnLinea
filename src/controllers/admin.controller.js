'use strict'

const Admin = require('../models/admin.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')

function obtenerAdministrador(req, res) {
    var params = req.body;
    Admin.findOne({user: params.user}, (err, adminEncontrado)=>{
        if (err) return res.status(500).send({mensaje: 'Error interno'})
        if(adminEncontrado) {
            bcrypt.compare(params.password, adminEncontrado.password, (err, passCorrect)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la password'});
                if(passCorrect) {
                    if(params.obtenerToken) {
                        return res.status(500).send({Toeken: jwt.obtenerToken(adminEncontrado)});
                    } else {
                        adminEncontrado.password = undefined;
                        return res.status(500).send({adminEncontrado});
                    }
                } else {
                    return res.status(500).send({mensaje: 'Password incorrecta'})
                }
            })
        } else {
            return res.status(500).send({mensaje: 'El administrador no existe'})
        }
    })
}

module.exports = {
    obtenerAdministrador
}