const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const pizzaRoutes = require('./routes/pizza'); // Rota para pizzas
const pedidoRoutes = require('./routes/pedido'); // Rota para pedidos

dotenv.config();

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota para pizzas
app.use('/pizzas', pizzaRoutes);

// Rota para pedidos
app.use('/pedidos', pedidoRoutes);

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Conectado ao MongoDB');
  // Iniciar servidor após conexão
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
})
.catch(err => {
  console.error('Erro ao conectar no MongoDB:', err);
});
