const urlPizzas = "http://localhost:3001/pizzas";  // Substituir pela URL correta
const urlBebidas = "http://localhost:3001/bebidas";  // Substituir pela URL correta
const urlSobremesas = "http://localhost:3001/sobremesas";  // Substituir pela URL correta

// Função para buscar pizzas do backend
async function buscarPizzas() {
    try {
        const response = await fetch(urlPizzas);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar pizzas:", error);
    }
}

// Função para buscar bebidas do backend
async function buscarBebidas() {
    try {
        const response = await fetch(urlBebidas);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar bebidas:", error);
    }
}

// Função para buscar sobremesas do backend
async function buscarSobremesas() {
    try {
        const response = await fetch(urlSobremesas);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar sobremesas:", error);
    }
}

// Função para adicionar pizza ao pedido
function adicionarPizza() {
    buscarPizzas().then(pizzas => {
        const pizzasContainer = document.getElementById("pizzasContainer");
        pizzas.forEach(pizza => {
            const pizzaDiv = document.createElement("div");
            pizzaDiv.innerHTML = `
                <input type="checkbox" name="pizza" value="${pizza._id}">
                <label>${pizza.nome} - R$ ${pizza.preco}</label>
            `;
            pizzasContainer.appendChild(pizzaDiv);
        });
    });
}

// Função para adicionar bebida ao pedido
function adicionarBebida() {
    buscarBebidas().then(bebidas => {
        const bebidasContainer = document.getElementById("bebidasContainer");
        bebidas.forEach(bebida => {
            const bebidaDiv = document.createElement("div");
            bebidaDiv.innerHTML = `
                <input type="checkbox" name="bebida" value="${bebida._id}">
                <label>${bebida.nome} - R$ ${bebida.preco}</label>
            `;
            bebidasContainer.appendChild(bebidaDiv);
        });
    });
}

// Função para adicionar sobremesa ao pedido
function adicionarSobremesa() {
    buscarSobremesas().then(sobremesas => {
        const sobremesasContainer = document.getElementById("sobremesasContainer");
        sobremesas.forEach(sobremesa => {
            const sobremesaDiv = document.createElement("div");
            sobremesaDiv.innerHTML = `
                <input type="checkbox" name="sobremesa" value="${sobremesa._id}">
                <label>${sobremesa.nome} - R$ ${sobremesa.preco}</label>
            `;
            sobremesasContainer.appendChild(sobremesaDiv);
        });
    });
}

// Função para salvar o pedido
document.getElementById("pedidoForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const cliente = document.getElementById("cliente").value;
    const status = document.getElementById("statusSelect").value;
    const dataCadastro = document.getElementById("dataCadastro").value;
    const pizzasSelecionadas = [...document.querySelectorAll('input[name="pizza"]:checked')].map(checkbox => checkbox.value);
    const bebidasSelecionadas = [...document.querySelectorAll('input[name="bebida"]:checked')].map(checkbox => checkbox.value);
    const sobremesasSelecionadas = [...document.querySelectorAll('input[name="sobremesa"]:checked')].map(checkbox => checkbox.value);

    const pedido = {
        cliente,
        status,
        dataCadastro,
        pizzas: pizzasSelecionadas,
        bebidas: bebidasSelecionadas,
        sobremesas: sobremesasSelecionadas
    };

    // Enviar pedido para o backend
    fetch("http://localhost:3001/pedidos", {  // Substituir pela URL correta
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pedido)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Pedido salvo:", data);
        alert("Pedido salvo com sucesso!");
    })
    .catch(error => {
        console.error("Erro ao salvar pedido:", error);
        alert("Erro ao salvar pedido!");
    });
});
