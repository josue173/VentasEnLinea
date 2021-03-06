'use strict'

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const ventas = express();

const admin_routes = require('./src/routes/admin.routes');

ventas.use(bodyParser.urlencoded({extended: false}));
ventas.use(bodyParser.json())

ventas.use(cors());

ventas.use('/ventas', admin_routes);

module.exports = ventas;