// src/App.jsx
import CriarPizza from './pages/CriarPizza'; // importa o componente CriarPizza

function App() {
  return (
    <div>
      <h1>🛒 Sistema da Pizzaria</h1>
      <CriarPizza /> {/* Aqui você renderiza o componente */}
    </div>
  );
}

export default App;
