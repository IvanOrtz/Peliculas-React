import './App.css';
import logo from "./assets/img/logo.png";
import Pelicula from './Pelicula';
import Buscador from './Buscador';
import DetallePelicula from './DetallePelicula';
import { useEffect, useState } from 'react';

function App() {
  const [datos, setDatos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [filtrosBusqueda, setFiltrosBusqueda] = useState({
    titulo: '',
    tipo: '',
    year: ''
  });
  const [cargando, setCargando] = useState(false);
  const [viendoFavoritos, setViendoFavoritos] = useState(false);
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null);
  const [favoritos, setFavoritos] = useState(() => {
    return JSON.parse(localStorage.getItem("favoritos")) || [];
  });

  // Fetch de películas
  useEffect(() => {
    if (viendoFavoritos) return; // No hacer fetch cuando vemos favoritos

    const { titulo, tipo, year } = filtrosBusqueda;
    const url = `https://www.omdbapi.com/?apikey=e8d14891&s=${titulo}&type=${tipo}&y=${year}&page=${pagina}`;
    setCargando(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.Search) {
          setDatos(prev => [...prev, ...data.Search]);
        }
      })
      .finally(() => setCargando(false));
  }, [pagina, filtrosBusqueda, viendoFavoritos]);

  // Scroll infinito
  useEffect(() => {
    const handleScroll = () => {
      if (viendoFavoritos || cargando) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        setPagina(prev => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [cargando, viendoFavoritos]);

  // Función para manejar filtros desde el buscador
  function handleBuscar(filtros) {
    setPagina(1);
    setDatos([]);
    setViendoFavoritos(false);
    setFiltrosBusqueda(filtros);
  }

  // Abrir detalle de película
  const handleClickPelicula = (imdbID) => {
    fetch(`https://www.omdbapi.com/?apikey=e8d14891&i=${imdbID}`)
      .then(res => res.json())
      .then(data => setPeliculaSeleccionada(data));
  };

  // Mostrar favoritos
  const mostrarFavoritos = () => {
  const idsFavoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  if (idsFavoritos.length === 0) {
    setDatos([]);
    return;
  }

  setPagina(1);
  setFiltrosBusqueda({ titulo: '', tipo: '', year: '' });
  setViendoFavoritos(true);

  const resultados = [];
  let completados = 0;

  idsFavoritos.forEach(id => {
    fetch(`https://www.omdbapi.com/?apikey=e8d14891&i=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.Response !== "False") resultados.push(data);
      })
      .finally(() => {
        completados++;
        if (completados === idsFavoritos.length) {// Todos los fetch terminaron
          setDatos([...resultados]);
        }
      });
  });
};

  const peliculas = datos.map((peli, index) => (
    <div key={peli.imdbID || index} onClick={() => handleClickPelicula(peli.imdbID)}>
      <Pelicula Title={peli.Title} Poster={peli.Poster} Year={peli.Year} />
    </div>
  ));

  return (
    <>
      <div id="logoContainer">
        <img src={logo} alt="Logo" id="logo" />
      </div>
      <Buscador onBuscar={handleBuscar} mostrarFavoritos={mostrarFavoritos} filtros={filtrosBusqueda}/>
      <div id="peliculas">{peliculas}</div>
      <button id="btn-up" title="Volver arriba" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>

      {peliculaSeleccionada && (
        <DetallePelicula
          data={peliculaSeleccionada}
          onClose={() => setPeliculaSeleccionada(null)}
          favoritos={favoritos}
          setFavoritos={setFavoritos}
        />
      )}
    </>
  );
}

export default App;