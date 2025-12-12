import notFound from "./assets/img/image_notFound.png";

function Pelicula({ Title, Poster, Year }) {
  return (
    <div className="card">
        <img src={Poster !== "N/A" ? Poster : notFound} alt={Title} onError={(e) => {e.target.src = notFound;}}/>
        <h2>{Title}</h2>
        <p>{Year}</p>
    </div>
  );
}

export default Pelicula;