'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var admiSchema = Schema({
    usuario: String,
    contrasena: String
})

module.exports = mongoose.model('administradores', admiSchema)