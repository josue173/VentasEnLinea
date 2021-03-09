'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var productosScheman = Schema({
    nombre: String,
    cantidad: Number
})

module.exports = mongoose.model('productos', productosScheman);