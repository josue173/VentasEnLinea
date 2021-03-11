"use strict";

const Usuarios = require("../models/usuarios.model");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const Productos = require("../models/productos.model");
var productosModel = new Productos();

function loginUsuarios(req, res) {
  var params = req.body;
  Usuarios.findOne({ usuario: params.usuario }, (err, usuarioEncontrados) => {
    if (err) return res.status(500).send({ mensaje: "Error interno" });
    if (usuarioEncontrados) {
      bcrypt.compare(
        params.contrasena,
        usuarioEncontrados.contrasena,
        (err, passCorrect) => {
          if (err)
            return res.status(500).send({ mensaje: "Error en la password" });
          if (passCorrect) {
            if (params.obtenerToken) {
              return res
                .status(500)
                .send({ Token: jwt.createToken(usuarioEncontrados) });
            } else {
              usuarioEncontrados.contrasena = undefined;
              return res.status(500).send({ usuarioEncontrados });
            }
          } else {
            return res.status(500).send({ mensaje: "Password incorrecta" });
          }
        }
      );
    } else {
      return res.status(500).send({ mensaje: "El Usuariosistrador no existe" });
    }
  });
}

function agregarProductos(req, res) {
  if (req.usuario.rol === "Administrador") {
    var params = req.body;
    if (params.nombre && params.cantidad) {
      Productos.findOne(
        { nombre: params.nombre },
        (err, productoEncontrado) => {
          if (err) return res.status(500).send({ mensaje: "Error interno" });
          if (productoEncontrado) {
            return res.status(500).send({ mensaje: "El producto ya existe" });
          } else {
            productosModel.nombre = params.nombre;
            productosModel.cantidad = params.cantidad;
            productosModel.save((err, productosAgregados) => {
              if (err)
                return res
                  .status(500)
                  .send({ mensaje: "Error interno al guardar" });
              if (productosAgregados) {
                return res.status(200).send({ productosAgregados });
              }
            });
          }
        }
      );
    }
  } else {
    return res.status(500).send({ mensaje: "Usted no es administrador" });
  }
}

function buscarProductos(req, res) {
  var params = req.body;
  if (req.usuario.rol === "Administrador") {
    Usuarios.findOne({ usuario: params.usuario }, (err, usuarioEncontrados) => {
      if (err)
        return res
          .status(500)
          .send({ mensaje: "Error interno al buscar Usuariosistrador" });
      if (!usuarioEncontrados)
        return res.status(500).send({
          mensaje: "No hay coincidencias con el nombre del Usuariosistrador",
        });
      if (usuarioEncontrados) {
        bcrypt.compare(
          params.contrasena,
          usuarioEncontrados.contrasena,
          (err, passCorrect) => {
            if (err)
              return res
                .status(500)
                .send({ mensaje: "Error interno al verificar contrasena" });
            if (passCorrect) {
              Productos.find((err, productosEncontrados) => {
                if (err)
                  return res
                    .status(500)
                    .send({ mensaje: "Error interno al buscar productos" });
                if (!productosEncontrados)
                  return res.status({
                    mensaje: "No hay productos en stock",
                  });
                return res.status(200).send({ productosEncontrados });
              });
            } else {
              return res.status(500).send({ mensaje: "Contrasena invalida" });
            }
          }
        );
      }
    });
  } else {
    return res.status(500).send({ mensaje: "Usted no es administrador" });
  }
}

function editarProductos(req, res) {
  var productoID = req.params.productoID;
  var params = req.body;
  if ((req.usuario.rol = "Administrador")) {
    Productos.findByIdAndUpdate(
      { _id: productoID },
      { nombre: params.producto, cantidad: params.cantidad },
      { new: true },
      (err, productoEditado) => {
        if (err)
          return res
            .status(500)
            .send({ mensaje: "Error interno al actualizar productos" });
        if (productoEditado) {
          return res.status(200).send({ productoEditado });
        } else {
          return res.status(500).send;
        }
      }
    );
  } else {
    return res.status(500).send({ mensaje: "El producto no existe" });
  }
}

module.exports = {
  loginUsuarios,
  agregarProductos,
  buscarProductos,
  editarProductos,
};
