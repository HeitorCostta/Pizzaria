const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');

// Criar novo pedido
router.post('/', async (req, res) => {
  try {
    const novoPedido = new Pedido(req.body);
    const pedidoSalvo = await novoPedido.save();
    res.status(201).json(pedidoSalvo);
  } catch (err) {
    console.error('Erro ao criar pedido:', err);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

// Listar todos os pedidos
router.get('/', async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate('pizzas.pizzaId');  // Popula o campo pizzaId com os dados das pizzas
    res.json(pedidos);
  } catch (err) {
    console.error('Erro ao buscar pedidos:', err);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// Atualizar status de um pedido
router.put('/:id/status', async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' });
    }

    pedido.status = req.body.status || pedido.status;  // Atualiza o status
    const pedidoAtualizado = await pedido.save();
    res.status(200).json(pedidoAtualizado);
  } catch (err) {
    console.error('Erro ao atualizar pedido:', err);
    res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
});

module.exports = router;
