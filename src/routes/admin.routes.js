'use strict'

const express = require('express');
const adminController = require('../controllers/admin.controller');
const verification = require('../middlewares/verification');

const ventas = express.Router();

ventas.post('/obtenerAdministrador', adminController.obtenerAdministrador);
ventas.post('/agregarProductos/:adminID', verification.ensureAuth, adminController.agregarProductos);
ventas.post('/buscarProductos/:adminID', verification.ensureAuth, adminController.buscarProductos);
ventas.post('/buscarProductosPorNomobre/:adminID', verification.ensureAuth, adminController.buscarProductosPorNombre);

module.exports = ventas;