const express = require('express');
const router = express.Router();
const Pizza = require('../models/Pizza');

// Criar nova pizza
router.post('/', async (req, res) => {
  try {
    const novaPizza = new Pizza(req.body);
    const pizzaSalva = await novaPizza.save();
    res.status(201).json(pizzaSalva);
  } catch (err) {
    console.error('Erro ao cadastrar pizza:', err);
    res.status(500).json({ error: 'Erro ao cadastrar pizza' });
  }
});

// Listar todas as pizzas
router.get('/', async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.json(pizzas);
  } catch (err) {
    console.error('Erro ao buscar pizzas:', err);
    res.status(500).json({ error: 'Erro ao buscar pizzas' });
  }
});

// Buscar uma pizza por ID
router.get('/:id', async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ mensagem: 'Pizza não encontrada' });
    }
    res.status(200).json(pizza);
  } catch (erro) {
    console.error('Erro ao buscar pizza por ID:', erro);
    res.status(500).json({ mensagem: 'Erro interno ao buscar a pizza' });
  }
});

module.exports = router;
