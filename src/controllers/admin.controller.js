'use strict'

const Admin = require('../models/admin.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Productos = require('../models/productos.model');

function obtenerAdministrador(req, res) {
    var params = req.body;
    Admin.findOne({usuario: params.usuario}, (err, adminEncontrado)=>{
        if (err) return res.status(500).send({mensaje: 'Error interno'})
        if(adminEncontrado) {
            bcrypt.compare(params.contrasena, adminEncontrado.contrasena, (err, passCorrect)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la password'});
                if(passCorrect) {
                    if(params.obtenerToken) {
                        return res.status(500).send({Token: jwt.createToken(adminEncontrado)});
                    } else {
                        adminEncontrado.contrasena = undefined;
                        return res.status(500).send({adminEncontrado});
                    }
                } else {
                    return res.status(500).send({mensaje: 'Password incorrecta'})
                }
            })
        } else {
            return res.status(500).send({mensaje: 'El administrador no existe'})
        }
    })
}

function agregarProductos(req,res) {
    var productosModel = new Productos();
    var adminID = req.params.adminID;
    var params = req.body;
    if(adminID != req.usuario.sub){
        return res.status(500).send({mensaje: 'No estas logeado'})
    } else if (params.nombre && params.cantidad){
        Admin.findOne({usuario: params.usuario}, (err, adminEncontrado)=>{
            if(err) return res.status(500).send({mensaje: 'Error interno al buscar administrador'});
            if(!adminEncontrado) return res.status(500).send({mensaje: 'No se encontraron coincidencias'});
            if(adminEncontrado){
                bcrypt.compare(params.contrasena, adminEncontrado.contrasena, (err, passCorrect)=>{
                    if(err) return res.status(500).send({mensaje: 'Error interno al comparar la password'});
                    if(passCorrect) {
                        Productos.findOne({nombre: params.nombre}, (err, productoEncontrado)=>{
                            if(err) return res.status(500).send({mensaje: 'Error interno'});
                            if (productoEncontrado) {
                                return res.status(500).send({mensaje: 'El producto ya existe'})
                            } else {    
                                productosModel.nombre = params.nombre;
                                productosModel.cantidad = params.cantidad;
                                productosModel.save((err, productosAgregados)=>{
                                    if(err) return res.status(500).send({mensaje: 'Error interno al guardar'});
                                    if(productosAgregados){
                                    return res.status(200).send({productosAgregados});
                                }
                              })

                            }
                        })                        
                    } else {
                        return res.status(500).send({mensaje: 'Password incorrecta'});
                    }
                })
            }
        })
    } else {
        return res.status(500).send({mensaje: 'No contiene los datos necesarios para agregar el producto'})
    }
}

function buscarProductos(req,res) {
    var adminID = req.params.adminID;
    var params = req.body;
    if (adminID != req.usuario.sub) {
        return res.status(500).send({mensaje: 'ID invalida'})
    } else {
        if (params.usuario && params.contrasena) {
            Admin.findOne({usuario: params.usuario}, (err, adminEncontrado)=>{
                if (err) return res.status(500).send({mensaje: 'Error interno al buscar administrador'});
                if (!adminEncontrado) return res.status(500).send({mensaje: 'No hay coincidencias con el nombre del administrador'});
                if (adminEncontrado){
                    bcrypt.compare(params.contrasena, adminEncontrado.contrasena, (err, passCorrect)=>{
                        if(err) return res.status(500).send({mensaje: 'Error interno al verificar contrasena'});
                        if (passCorrect) {
                            Productos.find((err, productosEncontrados)=>{
                                if (err) return res.status(500).send({mensaje: 'Error interno al buscar productos'})
                                if(!productosEncontrados) return res.status({mensaje: 'No hay productos en stock'});
                                return res.status(200).send({productosEncontrados});
                            })    
                        } else {
                            return res.status(500).send({mensaje: 'Contrasena invalida'});
                        }
                    })
                } 
            })    
        } else {
            return res.status(500).send({mensaje: 'Llene los campos necesarios'})
        }
    }
}

function buscarProductosPorNombre(req, res) {
    var adminID = req.params.adminID;
    var params = req.body;
    if (params.nombre) {
        Admin.findOne({usuario: params.usuario}, (err, adminEncontrado)=>{
            if(err) return res.status(500).send({mensaje: 'Error interno al buscar administrador'});
            if (adminEncontrado) {
                Productos.find({nombre: params.nombre}, (err, productoEncontrado)=>{
                    if(err) return res.status(500).send({mensaje: 'Error inerno al buscar producto'});
                    if(productoEncontrado){
                        return res.status(500).send({productoEncontrado});
                    } else {
                        return res.status(500).send({mensaje: 'No hay coincidencias'});
                    }
                })
            } else {
                return res.status(500).send({mensaje: 'El usuario no pertenece a los administradores'});
            }
        })
    } else {
        return res.status(500).send({mensaje: 'Llene los campo necesarios'});
    }
}

module.exports = {
    obtenerAdministrador,
    agregarProductos,
    buscarProductos,
    buscarProductosPorNombre
}