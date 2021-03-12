"use strict";

const Usuarios = require("../models/usuarios.model");
const Categorias = require("../models/productos.model");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const Productos = require("../models/productos.model");
var productosModel = new Productos();
var categoriasModel = new Categorias();

function loginUsuarios(req, res) {
  let params = req.body;
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

//FUNCIONES DE PRODUCTOS

function agregarProductos(req, res) {
  let params = req.body;
  if (req.usuario.rol === "Administrador") {
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
  if (req.usuario.rol === "Administrador") {
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
    return res.status(500).send({ mensaje: "Usted no es administrador" });
  }
}

function editarProductos(req, res) {
  let productoID = req.params.productoID;
  let params = req.body;
  if ((req.usuario.rol = "Administrador")) {
    Productos.findOne({ nombre: params.nombre }, (err, productoEncontrado) => {
      if (err) return res.status(500).send({ mensaje: "Error interno" });
      if (productoEncontrado) {
        return res.status(500).send({ mensaje: "El producto ya existe" });
      } else {
        Productos.findByIdAndUpdate(
          { _id: productoID },
          params,
          { new: true },
          (err, productoEditado) => {
            if (err)
              return res
                .status(500)
                .send({ mensaje: "Error interno al actualizar productos" });
            if (productoEditado) {
              return res.status(200).send({ productoEditado });
            } else {
              return res.status(500).send({ mensaje: "El producto no existe" });
            }
          }
        );
      }
    });
  } else {
    return res.status(500).send({ mensaje: "Usted no es administrador" });
  }
}

function eliminarProductos(req, res) {
  let productoID = req.params.productoID;
  if (req.usuario.rol === "Administrador") {
    Productos.findByIdAndDelete(productoID, (err, productoEliminado) => {
      if (err)
        return res
          .status(200)
          .send({ mensaje: "Error interno en eliminar el producto" });
      if (!productoEliminado)
        return res
          .status(500)
          .send({ mensaje: "El producto que quiere eliminar no existe" });
      return res.status(200).send({ productoEliminado });
    });
  } else {
    return res.status(500).send({ mensaje: "Usted no es administrador" });
  }
}

//FUNCIONES DE CATEGORIAS

function agregarCategorias(req, res) {
  let params = req.body;
  if (req.usuario.rol === "Administrador") {
    if (params.nombre) {
      Categorias.findOne(
        { nombre: params.nombre },
        (err, categoriaEncontrada) => {
          if (err) return res.status(500).send({ mensaje: "Error interno" });
          if (categoriaEncontrada) {
            return res.status(500).send({ mensaje: "La categoria ya existe" });
          } else {
            categoriasModel.nombre = params.nombre;
            categoriasModel.save((err, categoriaAgregada) => {
              if (err)
                return res
                  .status(500)
                  .send({ mensaje: "Error interno en agregar la categoria" });
              if (categoriaAgregada)
                return res.status(500).send({ categoriaAgregada });
            });
          }
        }
      );
    } else {
      return res.status(500).send({
        mensaje: "No contiene los campos o esta agregando campos inncesarios",
      });
    }
  } else {
    return res.status(500).send({ mensaje: "Usted no es un administrador" });
  }
}

module.exports = {
  loginUsuarios,
  agregarProductos,
  buscarProductos,
  editarProductos,
  eliminarProductos,
  agregarCategorias,
};
