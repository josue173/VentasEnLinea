'use strict'

const express = require('express');
const adminController = require('../controllers/admin.controller');

const ventas = express.Router();

ventas.post('/obtenerAdministrador', adminController.obtenerAdministrador);

module.exports = ventas;