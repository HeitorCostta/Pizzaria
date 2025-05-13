const form = document.getElementById('itemForm');
const lista = document.getElementById('listaItens');
const modoInput = document.getElementById('modo');
const idInput = document.getElementById('idItem');
const submitBtn = document.getElementById('submitBtn');

document.getElementById('tipo').addEventListener('change', function () {
  const tipo = this.value;
  document.getElementById('embalagemField').style.display = tipo === 'bebida' ? 'block' : 'none';
  document.getElementById('tipoSobremesaField').style.display = tipo === 'sobremesa' ? 'block' : 'none';
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const tipo = document.getElementById('tipo').value;
  const nome = document.getElementById('nome').value;
  const descricao = document.getElementById('descricao').value;
  const preco = parseFloat(document.getElementById('preco').value);
  const imagem = document.getElementById('imagem').value;
  const embalagem = tipo === 'bebida' ? document.getElementById('embalagem').value : undefined;
  const tipoSobremesa = tipo === 'sobremesa' ? document.getElementById('tipoSobremesa').value : undefined;

  const data = { nome, descricao, preco, imagem };

  if (tipo === 'bebida') {
    data.embalagem = embalagem;
  } else if (tipo === 'sobremesa') {
    data.tipo = tipoSobremesa; // <- Corrigido aqui
  }

  try {
    let url = `http://localhost:3001/${tipo === 'bebida' ? 'bebidas' : 'sobremesas'}`;
    let method = 'POST';

    if (modoInput.value === 'editar') {
      url += `/${idInput.value}`;
      method = 'PUT';
    }

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Erro ao salvar');

    alert(modoInput.value === 'editar' ? 'Item atualizado!' : 'Item cadastrado!');
    form.reset();
    modoInput.value = 'criar';
    idInput.value = '';
    submitBtn.textContent = 'Cadastrar';
    document.getElementById('embalagemField').style.display = 'none';
    document.getElementById('tipoSobremesaField').style.display = 'none';

    carregarItens();
  } catch (err) {
    alert('Erro ao enviar dados');
    console.error(err);
  }
});

function editarItem(item, tipo) {
  document.getElementById('tipo').value = tipo;
  document.getElementById('tipo').dispatchEvent(new Event('change'));

  document.getElementById('nome').value = item.nome;
  document.getElementById('descricao').value = item.descricao;
  document.getElementById('preco').value = item.preco;
  document.getElementById('imagem').value = item.imagem;
  document.getElementById('embalagem').value = item.embalagem || '';
  document.getElementById('tipoSobremesa').value = item.tipo || ''; // <- Corrigido aqui também

  modoInput.value = 'editar';
  idInput.value = item._id;
  submitBtn.textContent = 'Atualizar';
}

async function excluirItem(id, tipo) {
  if (!confirm('Deseja realmente excluir este item?')) return;

  try {
    const response = await fetch(`http://localhost:3001/${tipo}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erro ao excluir');

    alert('Item excluído com sucesso!');
    carregarItens();
  } catch (err) {
    alert('Erro ao excluir item');
  }
}

async function carregarItens() {
  lista.innerHTML = '';

  for (const tipo of ['bebidas', 'sobremesas']) {
    const response = await fetch(`http://localhost:3001/${tipo}`);
    const itens = await response.json();

    itens.forEach(item => {
      const div = document.createElement('div');
      div.className = 'itemCard';
      div.innerHTML = `
        <strong>${item.nome}</strong> - R$${item.preco.toFixed(2)}<br>
        <button onclick='editarItem(${JSON.stringify(item)}, "${tipo}")'>Editar</button>
        <button onclick='excluirItem("${item._id}", "${tipo}")'>Excluir</button>
        <hr>
      `;
      lista.appendChild(div);
    });
  }
}

window.onload = () => {
  modoInput.value = 'criar';
  carregarItens();
};
