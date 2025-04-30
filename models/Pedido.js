const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  pizzas: [{
    pizzaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza', required: true },
    tamanho: { type: String, required: true },
    quantidade: { type: Number, required: true }
  }],
  status: {
    type: String,
    enum: ['pendente', 'em preparo', 'entregue'],
    default: 'pendente'
  },
  dataCadastro: { type: Date, default: Date.now }
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;
