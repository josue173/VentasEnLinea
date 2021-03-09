'use strict'

const mongoose = require('mongoose');
const ventas = require('./app');
const bcrypt = require('bcrypt-nodejs');
var Admin = require('./src/models/admin.model');
var adminModel = new Admin();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ventasonline', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('Conexion exitosa a la base de datos')
    ventas.listen(3000, function(){
        adminModel.usuario = 'Ramon';
        Admin.find({ $or: [
                {usuario: adminModel.usuario}
            ]
        }).exec((err, adminEncontrado)=>{
            if (err) console.log('Error interno');
            if (adminEncontrado && adminEncontrado.length >= 1){
                console.log('El administrador ya existe');
            } else {
                bcrypt.hash('123456', null, null, (err, encpitacion)=>{
                    adminModel.contrasena = encpitacion;
                    adminModel.save((err, adminRegistrado)=>{
                        if (err) console.log('Error interno');
                        if (adminRegistrado){
                            console.log(adminRegistrado);
                        } else {
                            console.log('Error en la peticion de registro')
                        }
                    })
                })
            }
        })
        console.log('El servidor está corriendo en el puerto 3000');
    })
}).catch(err =>console.log(err))