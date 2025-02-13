import React, { useState, useEffect } from "react";

const API_BASE_URL = "https://content-diary-backend-production.up.railway.app";

const MovieDiary = () => {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [error, setError] = useState("");

  // Fetch watched movies from MongoDB on mount
  useEffect(() => {
    const fetchWatchedMovies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/watched-movies`);
        const data = await response.json();
        setWatchedMovies(data);
      } catch (err) {
        alert("Error fetching watched movies: " + err.message);
      }
    };
    fetchWatchedMovies();
  }, []);

  const fetchMovies = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://imdb-com.p.rapidapi.com/search?searchTerm=${encodeURIComponent(search)}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "imdb-com.p.rapidapi.com",
            "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          },
        }
      );

      if (!response.ok) {
        alert("API Error: " + response.statusText);
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Pop-up to show the raw API response
      alert("API Response:\n" + JSON.stringify(data, null, 2));

      if (data?.data?.mainSearch?.edges) {
        const formattedMovies = data.data.mainSearch.edges
          .map((item) => {
            const entity = item.node?.entity;
            return {
              id: entity?.id || "N/A",
              title: entity?.titleText?.originalTitleText?.text || entity?.titleText?.text || "Unknown Title",
              image: entity?.primaryImage?.url || "",
              year: entity?.releaseYear?.year || "N/A",
            };
          })
          .filter((movie) => movie.image !== "");

        // Pop-up to show formatted movies
        alert("Formatted Movies:\n" + JSON.stringify(formattedMovies, null, 2));

        setMovies(formattedMovies);
      } else {
        alert("No movies found.");
        setMovies([]);
      }
    } catch (error) {
      setError("Failed to fetch movies. Please try again later.");
      alert("Error fetching movies: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatched = async (movie) => {
    try {
      const response = await fetch(`${API_BASE_URL}/watched-movies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie),
      });

      if (response.ok) {
        setWatchedMovies([...watchedMovies, movie]);
        alert("Movie added to watchlist!");
      } else {
        alert("Failed to add movie.");
      }
    } catch (err) {
      alert("Error adding movie: " + err.message);
    }
  };

  const handleRemoveFromWatched = async (movie) => {
    try {
      await fetch(`${API_BASE_URL}/watched-movies/${movie.id}`, { method: "DELETE" });
      setWatchedMovies(watchedMovies.filter((m) => m.id !== movie.id));
      alert("Movie removed from watchlist!");
    } catch (err) {
      alert("Error removing movie: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            My Watch Diary
          </h1>
          <p className="text-gray-400">Keep track of your movie watching journey</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 flex space-x-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && fetchMovies()}
              placeholder="Search movies..."
              className="w-full p-3 pl-10 rounded-lg bg-gray-800 border border-gray-600 text-white"
            />
            <button onClick={fetchMovies} disabled={loading} className="px-6 py-3 bg-blue-600 rounded-lg text-white">
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
          <button onClick={() => setShowWatchlist(!showWatchlist)} className="px-6 py-3 bg-gray-700 rounded-lg text-white">
            {showWatchlist ? "Show Search" : "Show Watchlist"}
          </button>
        </div>

        {error && <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">{error}</div>}

        {showWatchlist ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {watchedMovies.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-12">Your watchlist is empty.</div>
            ) : (
              watchedMovies.map((movie) => (
                <div key={movie.id} className="bg-gray-800 p-4 rounded-lg">
                  <img src={movie.image} alt={movie.title} className="w-full h-40 object-cover rounded" />
                  <h2 className="text-lg mt-2">{movie.title}</h2>
                  <button onClick={() => handleRemoveFromWatched(movie)} className="mt-2 p-1 bg-red-600 rounded text-white">
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <p className="text-center text-gray-400">Search for movies to add to your watchlist.</p>
        )}
      </div>
    </div>
  );
};

export default MovieDiary;