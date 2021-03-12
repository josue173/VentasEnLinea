"use strcit";

const Usuarios = require("../models/usuarios.model");
const Productos = require("../models/productos.model");
const Categorias = require("../models/categorias.model");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const usuariosModel = new Usuarios();
const productosModel = new Productos();

function productosMasVendidos(req, res) {
  if (req.usuario.rol === "Cliente") {
  }
}

function buscarProductos(req, res) {
  let params = req.body;
  if (req.usuario.rol === "Cliente") {
    Productos.find(
      { nombre: { $regex: params.nombre, $options: "i" } },
      (err, productoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error interno" });
        if (!productoEncontrado)
          return res
            .status(500)
            .send({ mensaje: "Error al obtener productos" });
        return res.status(200).send({ productoEncontrado });
      }
    );
  } else {
    return res.status(500).send({ mensaje: "Usted no es un cliente" });
  }
}

function buscarCategorias(req, res) {
  let params = req.body;
  if (req.usuario.rol === "Cliente") {
    Categorias.find({ nombre: { $regex: params.nombre, $options: "i" } }).exec(
      (err, categoriasEncotradas) => {
        if (err) return res.status(500).send({ mensaje: "Error interno" });
        if (!categoriasEncotradas)
          return res
            .status(500)
            .send({ mensaje: "Error al obtener categorias" });
        return res.status(200).send({ categoriasEncotradas });
      }
    );
  } else {
    return res.status(500).send({ mensaje: "Usted no es un cliente" });
  }
}

function productosCategoria(req, res) {
  let categoriaID = req.params.categoriaID;
  Productos.find({ categoria: categoriaID })
    .populate("categoria", "nombre")
    .exec((err, categoriaEncontrada) => {
      if (err) return res.status(500).send({ mensaje: "Error interno" });
      if (!categoriaEncontrada)
        return res.status(500).send({ mensaje: "Error al obtener producto" });
      return res.status(200).send({ categoriaEncontrada });
    });
}

function agregarAlCarrito(req, res) {}

function factura(params) {}

//ESTE LOGIN ES ESPECIAL PARA EL CLIENTE PORQUE MUESTRA LA FACTURA
function loginCliente(params) {}

function editarPerfil(req, res) {
  let clienteID = req.params.clienteID;
  let params = req.body;
  delete params.rol;
  delete params.contrasena;
  if (req.usuario.rol === "Administrador") {
    return res.status(500).send({ mensaje: "Usted no es un Cliente" });
  } else {
    if (req.usuario.sub === clienteID) {
      Usuarios.findByIdAndUpdate(
        { _id: clienteID },
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
      return res
        .status(500)
        .send({ mensaje: "El ID de cliente no corresponde a su cuenta" });
    }
  }
}

function eliminarPerfil(req, res) {
  let clienteID = req.params.clienteID;
  if (req.usuario.rol === "Administrador") {
    return res.status(500).send({ mensaje: "Usted no es un Cliente" });
  } else {
    if (req.usuario.sub === clienteID) {
      Usuarios.findByIdAndDelete(clienteID, (err, perfilEliminado) => {
        if (err) return res.status(500).send({ mensaje: "Error interno" });
        if (!perfilEliminado)
          return res.status(500).send({ mensaje: "Error al eliminar perfil" });
        return res.status(200).send({ perfilEliminado });
      });
    } else {
      return res
        .status(500)
        .send({ mensaje: "El ID de cliente no corresponde a su perfil" });
    }
  }
}

module.exports = {
  buscarProductos,
  buscarCategorias,
  productosCategoria,
  editarPerfil,
  eliminarPerfil,
};
