const mongoose = require("mongoose");

const RegistroSchema = new mongoose.Schema({
  placa: { type: String, required: true },
  cidade: { type: String, required: true },
  dataHora: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Registro", RegistroSchema);
