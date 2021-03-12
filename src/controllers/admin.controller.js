"use strict";

const Usuarios = require("../models/usuarios.model");
const Productos = require("../models/productos.model");
const Categorias = require("../models/categorias.model");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const usuariosModel = new Usuarios();
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
      return res.status(500).send({ mensaje: "El usuario no existe" });
    }
  });
}

//GESTION DE PRODUCTOS

function agregarProductos(req, res) {
  let params = req.body;
  let categoriaID = req.params.categoriaID;
  if (req.usuario.rol === "Administrador") {
    if (params.nombre && params.cantidad) {
      productosModel.nombre = params.nombre;
      productosModel.cantidad = params.cantidad;
      productosModel.categoria = categoriaID;
      productosModel.save((err, productosAgregados) => {
        if (err)
          return res
            .status(500)
            .send({ mensaje: "Error interno en agregar productos" });
        if (!productosAgregados) {
          return res
            .status(500)
            .send({ mensaje: "Error al agregar productos" });
        } else {
          return res.status(200).send({ productosAgregados });
        }
      });
    } else {
      return res
        .status(500)
        .send({ mensaje: "No tiene los campos necesarios" });
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

//GESTION DE CATEGORIAS

/*
    categoriasModel.save((err, categoriaAgregada) => {
      if (err)
        return res.status(500).send({ mensaje: "Error interno al guardar" });
      if (!categoriaAgregada)
        return res
          .status(500)
          .send({ mensaje: "No hay informacion para guardar" });
      return res.status(200).send({ categoriaAgregada });
    });
  } else {
    return res.status(500).send({ mensaje: "Usted no es administrador" });
  }*/

function agregarCategorias(req, res) {
  let params = req.body;
  if (req.usuario.rol === "Administrador") {
    categoriasModel.nombre = params.nombre;
    Categorias.find({ $or: [{ nombre: params.nombre }] }).exec(
      (err, categoriaEncontrada) => {
        if (err) console.log("Error interno");
        if (categoriaEncontrada && categoriaEncontrada.length >= 1) {
          return res.status(500).send({ mensaje: "La categoria ya existe" });
        } else {
          categoriasModel.save((err, categoriaAgregada) => {
            if (err)
              return res
                .status(500)
                .send({ mensaje: "Error interno en agregar Categoria" });
            if (categoriaAgregada) {
              return res.status(200).send({ categoriaAgregada });
            } else {
              console.log("Error en la peticion de registro");
            }
          });
        }
      }
    );
  }
}

function agregarCategorias2(req, res) {
  var params = req.body;
  if (req.usuario.rol !== "Administrador") {
    res.status(500).send({ mensaje: "Usted no es administrador" });
  } else if (params.nombre) {
    categoriasModel.nombre = params.nombre;
    categoriasModel.save((err, categoriaAgregada) => {
      if (err) return res.status(500).send({ mensaje: "Error interno" });
      if (!categoriaAgregada) {
        return res.status(500).send({ mensaje: "Error al agregar categoria" });
      } else {
        return res.status(200).send({ categoriaAgregada });
      }
    });
  } else {
    return res.status(500).send({ mensaje: "Llene todos los campos" });
  }
}

function buscarCategorias(req, res) {
  if (req.usuario.rol === "Administrador") {
    Categorias.find((err, categoriasEncontradas) => {
      if (err)
        return res
          .status(500)
          .send({ mensaje: "Error interno en buscar las categorias" });
      if (categoriasEncontradas) {
        return res.status(200).send({ categoriasEncontradas });
      } else {
        return res.status(500).send({ mensaje: "No hay categorias agregadas" });
      }
    });
  } else {
    return res.status(500).send({ mensaje: "Usted no es adimistrador" });
  }
}

function editarCategoria(req, res) {
  let categoriaID = req.params.categoriaID;
  let params = req.body;
  if (req.usuario.rol === "Administrador") {
    if (params.nombre || params.cantidad) {
      Categorias.findByIdAndUpdate(
        { _id: categoriaID },
        params,
        { new: true },
        (err, categoriaEditada) => {
          if (err)
            return res
              .status(500)
              .send({ mensaje: "Error interno en buscar la categoria" });
          if (!categoriaEditada)
            return res
              .status(500)
              .send({ mensaje: "No se ha editado la categoria" });
          return res.status(200).send({ categoriaEditada });
        }
      );
    } else {
      return res
        .status(500)
        .send({ mensaje: "No hay informaciones en los campos" });
    }
  } else {
    return res.status(500).send({ mensaje: "Usted no es administrador" });
  }
}

function eliminarCategorias(req, res) {
  let categoriaID = req.params.categoriaID;
  if (req.usuario.rol === "Administrador") {
    Categorias.findByIdAndDelete(categoriaID, (err, categoriaEliminada) => {
      if (err)
        return res
          .status(200)
          .send({ mensaje: "Error interno en eliminar el categoria" });
      if (!categoriaEliminada)
        return res
          .status(500)
          .send({ mensaje: "La categoria que quiere eliminar no existe" });
      return res.status(200).send({ categoriaEliminada });
    });
  } else {
    return res.status(500).send({ mensaje: "Usted no es administrador" });
  }
}

//GESTION DE USUARIOS

function registroUsuarios(req, res) {
  let params = req.body;
  if (req.usuario.rol !== "Administrador") {
    return res.status(500).send({ mensaje: "Usted no es administrador" });
  } else {
    if (params.usuario && params.contrasena) {
      usuariosModel.usuario = params.usuario;
      usuariosModel.rol = "Cliente";
      Usuarios.find({
        $or: [{ usuario: usuariosModel.usuario }],
      }).exec((err, usuarioEncontrado) => {
        if (err)
          return res.status(500).send({ mensaje: "Error en la peticion" });
        if (usuarioEncontrado && usuarioEncontrado.length >= 1) {
          return res
            .status(500)
            .send({ mensaje: "El usuario ya existe ya existe" });
        } else {
          bcrypt.hash(params.contrasena, null, null, (err, passEncriptada) => {
            usuariosModel.contrasena = passEncriptada;
            usuariosModel.save((err, usuarioAgregado) => {
              if (usuarioAgregado) {
                return res.status(200).send({ usuarioAgregado });
              } else {
                return res
                  .status(500)
                  .send({ mensaje: "Error al agregar usuario" });
              }
            });
          });
        }
      });
    } else {
      return res
        .status(500)
        .send({ mensaje: "Datos insuficientes para agregar usuario" });
    }
  }
}

function editarUsuario(req, res) {
  let usuarioID = req.params.usuarioID;
  let params = req.body;
  delete params.contrasena;
  if (req.usuario.rol === "Administrador") {
    Usuarios.findById(usuarioID, (err, usuarioVerificar) => {
      if (err) return res.status(500).send({ mensaje: "Error interno" });
      if (!usuarioVerificar)
        return res.status({ mensaje: "Error al verficcar usuairio a editar" });
      if (usuarioVerificar.rol === "Cliente") {
        Usuarios.findByIdAndUpdate(
          { _id: usuarioID },
          params,
          { new: true },
          (err, usuarioEditado) => {
            if (err)
              return res
                .status(500)
                .send({ mensaje: "Error interno en buscar la categoria" });
            if (!usuarioEditado) {
              return res
                .status(500)
                .send({ mensaje: "No se ha editado la categoria" });
            } else {
              return res.status(200).send({ usuarioEditado });
            }
          }
        );
      } else {
        return res.status(500).send({
          mensaje:
            "El que intenta editar es administrador, por que no podra hacerlo",
        });
      }
    });
  } else {
    return res.status(500).send({ mensaje: "Usted no es administrador" });
  }
}

function eliminarUsuarios(req, res) {
  var usuarioID = req.params.usuarioID;
  if (req.usuario.rol === "Administrador") {
    Usuarios.findById(usuarioID, (err, usuarioVerificar) => {
      if (err) return res.status(500).send({ mensaje: "Error interno" });
      if (!usuarioVerificar)
        return res
          .status(500)
          .send({ mensaje: "Error al verificar usuario a eliminar" });
      if (usuarioVerificar.rol === "Administrador") {
        Usuarios.findByIdAndDelete(usuarioID, (err, usuarioEliminado) => {
          if (err) return res.status(500).send({ mensaje: "Error interno" });
          if (!usuarioEliminado)
            return res
              .status(500)
              .send({ mensaje: "No se ha podido eliminar el usuario" });
          return res.status(200).send({ usuarioEliminado });
        });
      } else {
        return res.status(500).send({
          mensaje:
            "El usuario que desea eliminar es administrador, por lo que no podra hacerlo",
        });
      }
    });
  } else {
    return res.status(500).send({ mensaje: "Usted no es administrador" });
  }
}

//GESTION DE FACTURAS

function facturas(params) {}

module.exports = {
  loginUsuarios,
  agregarProductos,
  buscarProductos,
  editarProductos,
  eliminarProductos,
  agregarCategorias,
  buscarCategorias,
  editarCategoria,
  eliminarCategorias,
  registroUsuarios,
  editarUsuario,
  eliminarUsuarios,
};
