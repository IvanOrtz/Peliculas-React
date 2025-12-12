import { useState, useEffect } from "react";

function Buscador({ onBuscar, mostrarFavoritos, filtros }) {
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("");
  const [year, setYear] = useState("");

  // Vaciar inputs al ver favoritos
  useEffect(() => {
    setTitulo(filtros.titulo || "");
    setTipo(filtros.tipo || "");
    setYear(filtros.year || "");
  }, [filtros]);

  function handleSubmit(e) {
    e.preventDefault();
    onBuscar({ titulo, tipo, year });
  }

  return (
    <form id="busquedaForm" onSubmit={handleSubmit}>
      <label htmlFor="titulo">Título:</label>
      <input
        type="text"
        id="titulo"
        value={titulo}
        onChange={(e) => {
          const value = e.target.value;
          setTitulo(value);

          if (value.length > 3) {
            onBuscar({ titulo: value, tipo, year });
          }
        }}
      />

      <label htmlFor="tipo">Tipo:</label>
      <select
        id="tipo"
        value={tipo}
        onChange={(e) => {
          const value = e.target.value;
          setTipo(value);
          onBuscar({ titulo, tipo: value, year });
        }}
      >
        <option value="">Todos</option>
        <option value="movie">Película</option>
        <option value="series">Serie</option>
      </select>

      <label htmlFor="anio">Año:</label>
      <input
        type="number"
        id="anio"
        min="1900"
        max="2099"
        value={year}
        onChange={(e) => {
          const value = e.target.value;
          setYear(value);
          onBuscar({ titulo, tipo, year: value });
        }}
      />

      <button type="submit">Buscar</button>
      <button
        type="button"
        id="btnFavoritos"
        className="fav-list-btn"
        onClick={mostrarFavoritos}
      >
        ⭐ Ver Favoritos
      </button>
    </form>
  );
}

export default Buscador;