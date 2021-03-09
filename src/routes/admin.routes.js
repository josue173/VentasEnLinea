'use strict'

const express = require('express');
const adminController = require('../controllers/admin.controller');
const verification = require('../middlewares/verification');

const ventas = express.Router();

ventas.post('/obtenerAdministrador', adminController.obtenerAdministrador);
ventas.post('/agregarProductos/:adminID', verification.ensureAuth, adminController.agregarProductos);

module.exports = ventas;