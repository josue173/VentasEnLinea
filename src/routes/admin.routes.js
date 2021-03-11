'use strict'

const express = require('express');
const adminController = require('../controllers/admin.controller');
const verification = require('../middlewares/verification');

const ventas = express.Router();

ventas.post('/obtenerAdministrador', adminController.loginUsuarios);
ventas.post('/agregarProductos', verification.ensureAuth, adminController.agregarProductos);
ventas.post('/buscarProductos', verification.ensureAuth, adminController.buscarProductos);
//ventas.post('/buscarProductosPorNomobre', verification.ensureAuth, adminController.buscarProductosPorNombre);
//ventas.put('/editarProductos/:productoID', adminController.editarProductos);

module.exports = ventas;