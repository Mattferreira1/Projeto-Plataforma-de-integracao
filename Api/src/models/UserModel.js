const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: { type: String },
  email: { type: String, unique: true, required: true },
  endereco: {
    numero: String,
    complemento: String,
    rua: String,
    bairro: String,
    cidade: String,
    estado: String,
    cep: String
  },
  role: { type: String, enum: ["produtor", "consumidor"], required: true },
  criadoEm: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

module.exports = User;