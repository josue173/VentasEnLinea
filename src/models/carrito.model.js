"use strict";

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var carritoSchema = Schema({
  productos: { type: Schema.Types.ObjectId, ref: "productos" },
  cantidad: Number,
  cliente: { type: Schema.Types.ObjectId, ref: "Usuarios" },
});

module.exports = mongoose.model("carrito", carritoSchema);
