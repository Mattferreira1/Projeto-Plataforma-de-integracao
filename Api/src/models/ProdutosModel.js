const mongoose =require("mongoose");

const productSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: true 
  },
  descricao: { 
    type: String 
  },
  preco: { 
    type: Number, 
    required: true 
  },
  quantidade: { 
    type: Number, 
    required: true 
  },
  unidade: { 
    type: String, 
    enum: ["kg", "unidade", "litro"], 
    required: true 
  },
  produtor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  criadoEm: { 
    type: Date, 
    default: Date.now 
  }
});

// Evita duplicar o model se houver hot reload
const Product = mongoose.models.Product || mongoose.model("Produtos", productSchema);

module.exports = Product
