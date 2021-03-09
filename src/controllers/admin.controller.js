'use strict'

const Admin = require('../models/admin.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Productos = require('../models/productos.model')

function obtenerAdministrador(req, res) {
    var params = req.body;
    Admin.findOne({user: params.user}, (err, adminEncontrado)=>{
        if (err) return res.status(500).send({mensaje: 'Error interno'})
        if(adminEncontrado) {
            bcrypt.compare(params.password, adminEncontrado.password, (err, passCorrect)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la password'});
                if(passCorrect) {
                    if(params.obtenerToken) {
                        return res.status(500).send({Token: jwt.createToken(adminEncontrado)});
                    } else {
                        adminEncontrado.password = undefined;
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
    if(adminID != req.usuario.id){
        return res.status(500).send({mensaje: 'No estas logeado'})
    } else if (params.nombre && params.cantidad){
        Admin.find({user: params.user}, (err, adminEncontrado)=>{
            if(err) return res.status(500).send({mensaje: 'Error interno al buscar administrador'});
            if(!adminEncontrado) return res.status(500).send({mensaje: 'No se encontraron coincidencias'});
            if(adminEncontrado){
                bcrypt.compare(params.password, adminEncontrado.password, (err, passCorrect)=>{
                    if(err) return res.status(500).send({mensaje: 'Error interno al comparar la password'});
                    if(passCorrect) {
                        productosModel.name = params.name;
                        productosModel.cantidad = parmas.cantidad;
                        Productos.save((err, productosAgregados)=>{
                            if(err) return res.status(500).send({mensaje: 'Error interno al guardar'});
                            if(productosAgregados){
                                return res.status(200).send({productosAgregados});
                            }
                        })
                    } else {
                        return res.status(500).send({mensaje: 'Password incorrecta'})
                    }
                })
            }
        })
    } else {
        return res.status(500).send({mensaje: 'No contiene los datos necesarios para agregar el producto'})
    }
    

}

module.exports = {
    obtenerAdministrador,
    agregarProductos
}