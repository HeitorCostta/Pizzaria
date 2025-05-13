// Função para carregar os pedidos
async function carregarPedidos() {
    try {
      const resposta = await fetch('http://localhost:3001/pedidos');
      const pedidos = await resposta.json();
  
      const tbody = document.querySelector('#tabelaPedidos tbody');
      tbody.innerHTML = '';
  
      pedidos.forEach(pedido => {
        const data = new Date(pedido.dataCadastro).toLocaleString('pt-BR');
  
        const tr = document.createElement('tr');
  
        tr.innerHTML = `
          <td>${pedido._id.slice(-5)}</td>
          <td>${pedido.cliente || '---'}</td>
          <td>${data}</td>
          <td><span class="status ${pedido.status}">${pedido.status}</span></td>
          <td>
            <button onclick="verDetalhes('${pedido._id}')">Ver Detalhes</button>
            <button onclick="finalizarPedido('${pedido._id}')">Finalizar</button>
            <button onclick="cancelarPedido('${pedido._id}')">Cancelar</button>
          </td>
        `;
  
        tbody.appendChild(tr);
      });
    } catch (erro) {
      console.error('Erro ao carregar pedidos:', erro);
    }
  }
  
  // Função para ver os detalhes do pedido no modal
  async function verDetalhes(id) {
    try {
      const resposta = await fetch(`http://localhost:3001/pedidos/${id}`);
      const pedido = await resposta.json();
  
      const modal = document.querySelector('#modalDetalhes');
      modal.querySelector('#modalID').textContent = pedido._id;
      modal.querySelector('#modalCliente').textContent = pedido.cliente || '---';
      modal.querySelector('#modalData').textContent = new Date(pedido.dataCadastro).toLocaleString('pt-BR');
      modal.querySelector('#modalStatus').textContent = pedido.status;
  
      // Exibir pizzas
      const ulPizzas = modal.querySelector('#modalPizzas');
      ulPizzas.innerHTML = '';
      pedido.pizzas.forEach(pizza => {
        const nomePizza = pizza.pizzaId ? pizza.pizzaId.nome : 'Sem nome';
        const precoPizza = pizza.pizzaId ? pizza.pizzaId.preco : 0;
        const li = document.createElement('li');
        li.textContent = `${pizza.tamanho} - ${pizza.quantidade} x ${nomePizza} - R$ ${precoPizza.toFixed(2)}`;
        ulPizzas.appendChild(li);
      });
  
      // Exibir bebidas
      const ulBebidas = modal.querySelector('#modalBebidas');
      ulBebidas.innerHTML = '';
      pedido.bebidas.forEach(bebida => {
        const li = document.createElement('li');
        if (bebida.bebidaId) {
          li.textContent = `${bebida.quantidade} x ${bebida.bebidaId.nome} - R$ ${bebida.bebidaId.preco.toFixed(2)}`;
        } else {
          li.textContent = `${bebida.quantidade} x [Bebida não encontrada]`;
        }
        ulBebidas.appendChild(li);
      });
  
      // Calcular o valor total
      const total = pedido.pizzas.reduce((acc, pizza) => acc + pizza.quantidade * (pizza.pizzaId ? pizza.pizzaId.preco : 0), 0) +
                   pedido.bebidas.reduce((acc, bebida) => acc + bebida.quantidade * (bebida.bebidaId ? bebida.bebidaId.preco : 0), 0);
      modal.querySelector('#modalTotal').textContent = `Total: R$ ${total.toFixed(2)}`;
  
      // Exibir modal
      modal.style.display = 'block';
    } catch (erro) {
      console.error('Erro ao carregar detalhes do pedido:', erro);
    }
  }
  
  // Função para finalizar o pedido
  async function finalizarPedido(id) {
    await fetch(`http://localhost:3001/pedidos/${id}/finalizar`, {
      method: 'PUT',
    });
    carregarPedidos();
  }
  
  // Função para cancelar o pedido
  async function cancelarPedido(id) {
    await fetch(`http://localhost:3001/pedidos/${id}/cancelar`, {
      method: 'PUT',
    });
    carregarPedidos();
  }
  
  // Carregar pedidos ao abrir a página
  carregarPedidos();
  
  // Função para fechar o modal de detalhes
  function fecharModal() {
    document.querySelector('#modalDetalhes').style.display = 'none';
  }
  
  // Adicionar evento de clique para fechar o modal
  document.querySelector('#fecharModal').addEventListener('click', fecharModal);
  