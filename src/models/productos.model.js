'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var productosScheman = ({
    name: String,
    cantidad: Number
})

module.exports = mongoose.model('productos', productosScheman);