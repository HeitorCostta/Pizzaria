const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  preco: { type: Number, required: true },
  ingredientes: [String], // Pode ser uma lista de strings
  tamanhos: [
    {
      tipo: { type: String, enum: ['Pequena', 'Média', 'Grande'], required: true },
      preco: { type: Number, required: true },
    },
  ],
  imagem: { type: String }, // URL ou caminho da imagem
  dataCadastro: { type: Date, default: Date.now },
});

const Pizza = mongoose.model('Pizza', pizzaSchema);

module.exports = Pizza;
