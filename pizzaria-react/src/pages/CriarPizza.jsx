import { useState, useEffect } from "react";
import './CriarPizza.css';

function CriarProduto() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [urlImagem, setUrlImagem] = useState("");
  const [precoUnico, setPrecoUnico] = useState(""); // Para produtos sem variação de tamanho
  const [tamanhos, setTamanhos] = useState({ pequena: "", media: "", grande: "" }); // Para pizzas
  const [produtos, setProdutos] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

  useEffect(() => {
    fetch("http://localhost:3001/produtos")
      .then((res) => res.json())
      .then((data) => setProdutos(data));
  }, []);

  const limparFormulario = () => {
    setNome("");
    setDescricao("");
    setIngredientes("");
    setUrlImagem("");
    setPrecoUnico("");
    setTamanhos({ pequena: "", media: "", grande: "" });
    setModoEdicao(false);
    setIdEditando(null);
  };

  const salvarProduto = () => {
    const produto = {
      nome,
      descricao,
      ingredientes,
      urlImagem,
      precoUnico: categoriaFiltro !== "Pizza" ? precoUnico : undefined, // Só usa precoUnico se não for pizza
      tamanhos: categoriaFiltro === "Pizza" ? tamanhos : [], // Só usa tamanhos se for pizza
      categoria: categoriaFiltro,
    };

    if (modoEdicao) {
      fetch(`http://localhost:3001/produtos/${idEditando}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto),
      })
        .then((res) => res.json())
        .then((dadosAtualizados) => {
          setProdutos((prev) =>
            prev.map((p) => (p._id === idEditando ? dadosAtualizados : p))
          );
          limparFormulario();
        });
    } else {
      fetch("http://localhost:3001/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto),
      })
        .then((res) => res.json())
        .then((novoProduto) => {
          setProdutos([...produtos, novoProduto]);
          limparFormulario();
        });
    }
  };

  const editarProduto = (produto) => {
    setNome(produto.nome);
    setDescricao(produto.descricao);
    setIngredientes(produto.ingredientes);
    setUrlImagem(produto.urlImagem);
    setPrecoUnico(produto.precoUnico);
    setTamanhos(produto.tamanhos);
    setModoEdicao(true);
    setIdEditando(produto._id);
  };

  const excluirProduto = (id) => {
    fetch(`http://localhost:3001/produtos/${id}`, {
      method: "DELETE",
    }).then(() => {
      setProdutos(produtos.filter((p) => p._id !== id));
    });
  };

  const produtosFiltrados = produtos.filter((p) => {
    const nomeMatch = p.nome.toLowerCase().includes(busca.toLowerCase());
    const categoriaMatch =
      categoriaFiltro === "Todas" || p.categoria === categoriaFiltro;
    return nomeMatch && categoriaMatch;
  });

  return (
    <div className="container">
      <div className="formulario-produto">
        <h2>Cadastro de Produto</h2>
        <input
          type="text"
          placeholder="Nome do Produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ingredientes"
          value={ingredientes}
          onChange={(e) => setIngredientes(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL da imagem"
          value={urlImagem}
          onChange={(e) => setUrlImagem(e.target.value)}
        />

        {categoriaFiltro === "Pizza" ? (
          <div className="precos">
            <input
              type="text"
              placeholder="Preço Pequena"
              value={tamanhos.pequena}
              onChange={(e) =>
                setTamanhos({ ...tamanhos, pequena: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Preço Média"
              value={tamanhos.media}
              onChange={(e) =>
                setTamanhos({ ...tamanhos, media: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Preço Grande"
              value={tamanhos.grande}
              onChange={(e) =>
                setTamanhos({ ...tamanhos, grande: e.target.value })
              }
            />
          </div>
        ) : (
          <div className="preco-unico">
            <input
              type="text"
              placeholder="Preço"
              value={precoUnico}
              onChange={(e) => setPrecoUnico(e.target.value)}
            />
          </div>
        )}

        <div className="btn-centro">
          <button onClick={salvarProduto}>
            {modoEdicao ? "Atualizar Produto" : "Salvar Produto"}
          </button>
        </div>
      </div>

      <div className="separador" />

      <div className="filtro-lista">
        <h3>Lista de Produtos</h3>
        <div className="filtros">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="Todas">Todas</option>
            <option value="Pizza">Pizza</option>
            <option value="Batata recheada">Batata Recheada</option>
            <option value="Tapioca">Tapioca</option>
            <option value="Sobremesa">Sobremesa</option>
            <option value="Panqueca">Panqueca</option>
          </select>
        </div>

        <table className="tabela-produtos">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Ingredientes</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.map((produto) => (
              <tr key={produto._id}>
                <td>{produto.nome}</td>
                <td>{produto.ingredientes}</td>
                <td>
                  {produto.tamanhos && produto.tamanhos.length > 0 ? (
                    <div>
                      {produto.tamanhos.pequena && (
                        <div>Pequena: R$ {produto.tamanhos.pequena}</div>
                      )}
                      {produto.tamanhos.media && (
                        <div>Média: R$ {produto.tamanhos.media}</div>
                      )}
                      {produto.tamanhos.grande && (
                        <div>Grande: R$ {produto.tamanhos.grande}</div>
                      )}
                    </div>
                  ) : (
                    <div>R$ {produto.precoUnico}</div>
                  )}
                </td>
                <td>
                  <button onClick={() => editarProduto(produto)}>Editar</button>
                  <button onClick={() => excluirProduto(produto._id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CriarProduto;
