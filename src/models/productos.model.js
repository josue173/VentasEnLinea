'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var productosScheman = ({
    nombre: String,
    descipcion: String,
    cantidad: Number
})

module.exports = mongoose.model('productos', productosScheman);