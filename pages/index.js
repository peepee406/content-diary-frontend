import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    if (!search) return;
    try {
      const res = await axios.get(`https://content-diary-backend-production.up.railway.app//api/imdb/search?title=${search}`);
      setMovies(res.data.Search || []);
    } catch (error) {
      console.error("Error fetching IMDb data", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">My Content Diary</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search for movies or series..."
          className="p-2 text-black rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={fetchMovies} className="bg-blue-500 px-4 py-2 rounded">Search</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="bg-gray-800 p-4 rounded-lg">
            <img src={movie.Poster} alt={movie.Title} className="rounded-lg" />
            <h2 className="mt-2 text-lg font-bold">{movie.Title}</h2>
            <p>{movie.Year}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
