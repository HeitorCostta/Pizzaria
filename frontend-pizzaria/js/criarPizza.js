const API_URL = 'http://localhost:3001/pizzas';

document.getElementById('formCriarPizza').addEventListener('submit', async function (event) {
  event.preventDefault();

  const pizza = montarObjetoPizza();

  try {
    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pizza)
    });

    if (resposta.ok) {
      alert('Pizza criada com sucesso!');
      limparFormulario();
    } else {
      alert('Erro ao criar a pizza.');
    }
  } catch (erro) {
    console.error('Erro:', erro);
    alert('Erro de comunicação com o servidor.');
  }
});

async function buscarPizza() {
  const id = document.getElementById('pizzaId').value.trim();
  if (!id) return alert('Informe o ID da pizza!');

  try {
    const resposta = await fetch(`${API_URL}/${id}`);
    if (!resposta.ok) return alert('Pizza não encontrada');

    const pizza = await resposta.json();

    document.getElementById('nome').value = pizza.nome;
    document.getElementById('descricao').value = pizza.descricao;
    document.getElementById('ingredientes').value = pizza.ingredientes.join(', ');
    document.getElementById('imagem').value = pizza.imagem || '';

    pizza.tamanhos.forEach(t => {
      if (t.tipo === 'Pequena') document.getElementById('pequenaPreco').value = t.preco;
      if (t.tipo === 'Média') document.getElementById('mediaPreco').value = t.preco;
      if (t.tipo === 'Grande') document.getElementById('grandePreco').value = t.preco;
    });

    alert('Pizza carregada com sucesso!');
  } catch (erro) {
    console.error('Erro ao buscar pizza:', erro);
    alert('Erro ao buscar pizza');
  }
}

async function atualizarPizza() {
  const id = document.getElementById('pizzaId').value.trim();
  if (!id) return alert('Informe o ID da pizza para atualizar!');

  const pizza = montarObjetoPizza();

  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pizza)
    });

    if (resposta.ok) {
      alert('Pizza atualizada com sucesso!');
      limparFormulario();
    } else {
      alert('Erro ao atualizar pizza.');
    }
  } catch (erro) {
    console.error('Erro ao atualizar pizza:', erro);
    alert('Erro de comunicação com o servidor.');
  }
}

function montarObjetoPizza() {
  return {
    nome: document.getElementById('nome').value,
    descricao: document.getElementById('descricao').value,
    ingredientes: document.getElementById('ingredientes').value.split(',').map(i => i.trim()),
    imagem: document.getElementById('imagem').value,
    preco: parseFloat(document.getElementById('pequenaPreco').value),
    tamanhos: [
      { tipo: 'Pequena', preco: parseFloat(document.getElementById('pequenaPreco').value) },
      { tipo: 'Média', preco: parseFloat(document.getElementById('mediaPreco').value) },
      { tipo: 'Grande', preco: parseFloat(document.getElementById('grandePreco').value) }
    ]
  };
}

function limparFormulario() {
  document.getElementById('pizzaId').value = '';
  document.getElementById('formCriarPizza').reset();
}


async function excluirPizza() {
  const id = document.getElementById('pizzaId').value.trim();
  if (!id) return alert('Informe o ID da pizza para excluir!');

  if (!confirm('Tem certeza que deseja excluir esta pizza?')) return;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (resposta.ok) {
      alert('Pizza excluída com sucesso!');
      limparFormulario();
    } else {
      alert('Erro ao excluir pizza.');
    }
  } catch (erro) {
    console.error('Erro ao excluir pizza:', erro);
    alert('Erro de comunicação com o servidor.');
  }
}


async function listarPizzas() {
  try {
    const resposta = await fetch(API_URL);
    const pizzas = await resposta.json();

    const tabela = document.getElementById('tabelaPizzas').querySelector('tbody');
    tabela.innerHTML = ''; // Limpa a tabela antes de preencher

    pizzas.forEach(pizza => {
      const tr = document.createElement('tr');

      // Coluna Nome
      const tdNome = document.createElement('td');
      tdNome.textContent = pizza.nome;
      tr.appendChild(tdNome);

      // Coluna Ingredientes
      const tdIngredientes = document.createElement('td');
      tdIngredientes.textContent = pizza.ingredientes.join(', ');
      tr.appendChild(tdIngredientes);

      // Coluna Tamanhos e Preços
      const tdTamanhos = document.createElement('td');
      tdTamanhos.innerHTML = pizza.tamanhos.map(t => `<strong>${t.tipo}:</strong> R$ ${t.preco.toFixed(2)}`).join('<br>');
      tr.appendChild(tdTamanhos);

      // Coluna Ações (Editar e Excluir)
      const tdAcoes = document.createElement('td');

      // Botão Editar
      const btnEditar = document.createElement('button');
      btnEditar.textContent = 'Editar';
      btnEditar.onclick = () => carregarPizzaParaEditar(pizza._id);
      tdAcoes.appendChild(btnEditar);

      // Botão Excluir
      const btnExcluir = document.createElement('button');
      btnExcluir.textContent = 'Excluir';
      btnExcluir.style.marginLeft = '5px';
      btnExcluir.onclick = () => excluirPizza(pizza._id);
      tdAcoes.appendChild(btnExcluir);

      tr.appendChild(tdAcoes);
      tabela.appendChild(tr);
    });

  } catch (erro) {
    console.error('Erro ao listar pizzas:', erro);
    alert('Erro ao buscar as pizzas');
  }
}

// Função para carregar pizza no formulário ao clicar em "Editar"
async function carregarPizzaParaEditar(id) {
  try {
    const resposta = await fetch(`${API_URL}/${id}`);
    if (!resposta.ok) return alert('Pizza não encontrada');

    const pizza = await resposta.json();

    document.getElementById('pizzaId').value = pizza._id;
    document.getElementById('nome').value = pizza.nome;
    document.getElementById('descricao').value = pizza.descricao;
    document.getElementById('ingredientes').value = pizza.ingredientes.join(', ');
    document.getElementById('imagem').value = pizza.imagem || '';

    pizza.tamanhos.forEach(t => {
      if (t.tipo === 'Pequena') document.getElementById('pequenaPreco').value = t.preco;
      if (t.tipo === 'Média') document.getElementById('mediaPreco').value = t.preco;
      if (t.tipo === 'Grande') document.getElementById('grandePreco').value = t.preco;
    });

    alert('Pizza carregada para edição!');
  } catch (erro) {
    console.error('Erro ao carregar pizza:', erro);
    alert('Erro ao carregar pizza para edição');
  }
}

// Função para excluir pizza
async function excluirPizza(id) {
  if (!confirm('Tem certeza que deseja excluir esta pizza?')) return;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (resposta.ok) {
      alert('Pizza excluída com sucesso!');
      listarPizzas(); // Atualiza a tabela após excluir
    } else {
      alert('Erro ao excluir pizza.');
    }
  } catch (erro) {
    console.error('Erro ao excluir pizza:', erro);
    alert('Erro de comunicação com o servidor.');
  }
}

// Chamar automaticamente ao abrir a página
listarPizzas();
