import { useEffect } from "react";
import notFound from "./assets/img/image_notFound.png";

function DetallePelicula({ data, onClose, favoritos, setFavoritos }) {
  if (!data) return null;

  const estaEnFavoritos = favoritos.includes(data.imdbID);

  const toggleFavorito = () => {
    if (estaEnFavoritos) {
      setFavoritos(favoritos.filter(id => id !== data.imdbID));
    } else {
      setFavoritos([...favoritos, data.imdbID]);
    }
  };

  // Guardar favoritos en localStorage
  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  return (
    <div
      id="overlay"
      onClick={(e) => {
        // Cierra si se clickea el fondo
        if (e.target.id === "overlay") onClose();
      }}
    >
      <div className="detalle">
          <img src={data.Poster !== "N/A" ? data.Poster : notFound} alt={data.Title} onError={(e) => {e.target.src = notFound;}}/>
        <div className="info">
          <h2>{data.Title}</h2>
          <button className="cerrar-btn" onClick={onClose}>
            &times;
          </button>
          <button className={`fav-btn ${estaEnFavoritos ? "fav-on" : ""}`} onClick={toggleFavorito}>
            {estaEnFavoritos ? "⭐ Quitar de Favoritos" : "⭐ Añadir a Favoritos"}
          </button>

          <div className="datos">
            <p><strong>Año:</strong> {data.Year}</p>
            <p><strong>Clasificación:</strong> {data.Rated}</p>
            <p><strong>Estreno:</strong> {data.Released}</p>
            <p><strong>Duración:</strong> {data.Runtime}</p>
            <p><strong>Director:</strong> {data.Director}</p>
            <p><strong>Guionista:</strong> {data.Writer}</p>
            <p><strong>Actores:</strong> {data.Actors}</p>
            <p><strong>Género:</strong> {data.Genre}</p>
            <p><strong>Idioma:</strong> {data.Language}</p>
            <p><strong>País:</strong> {data.Country}</p>
          </div>

          <p><strong>Sinopsis:</strong> {data.Plot}</p>

          <h3>⭐ Ratings</h3>
          <ul>
            {data.Ratings.map((r, i) => (
              <li key={i}>{r.Source}: {r.Value}</li>
            ))}
          </ul>

          <p><strong>Premios:</strong> {data.Awards}</p>
          <p><strong>Taquilla:</strong> {data.BoxOffice}</p>
        </div>
      </div>
    </div>
  );
}

export default DetallePelicula;