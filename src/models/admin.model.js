'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var admiSchema = Schema({
    user: String,
    password: String
})

module.exports = mongoose.model('administradores', admiSchema)