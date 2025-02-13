import React, { useState, useEffect } from "react";
import { AlertCircle, Loader2, Search, Film, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MovieDiary = () => {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedWatchedMovies = JSON.parse(localStorage.getItem("watchedMovies")) || [];
    setWatchedMovies(storedWatchedMovies);
  }, []);

  useEffect(() => {
    localStorage.setItem("watchedMovies", JSON.stringify(watchedMovies));
  }, [watchedMovies]);

  const fetchMovies = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`https://imdb-com.p.rapidapi.com/search?searchTerm=${encodeURIComponent(search)}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'imdb-com.p.rapidapi.com',
          'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

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

        setMovies(formattedMovies);
      } else {
        setMovies([]);
      }
    } catch (error) {
      setError("Failed to fetch movies. Please try again later.");
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatched = (movie) => {
    if (!watchedMovies.some((m) => m.id === movie.id)) {
      setWatchedMovies([...watchedMovies, { ...movie, dateAdded: new Date().toISOString() }]);
    }
  };

  const handleRemoveFromWatched = (movie) => {
    setWatchedMovies(watchedMovies.filter((m) => m.id !== movie.id));
  };

  const MovieCard = ({ movie, isWatched, onAction }) => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="relative w-40 h-56 overflow-hidden rounded-lg border border-gray-700">
        {movie.image ? (
          <img
            src={movie.image}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <Film className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>
      <h2 className="text-lg mt-3 text-center font-semibold line-clamp-2">{movie.title}</h2>
      <p className="text-sm text-gray-400 mt-1">{movie.year}</p>
      {isWatched && (
        <p className="text-xs text-gray-400 mt-1">
          Added: {new Date(movie.dateAdded).toLocaleDateString()}
        </p>
      )}
      <button
        onClick={() => onAction(movie)}
        className={`mt-3 px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 ${
          isWatched
            ? "bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            : "bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        }`}
      >
        {isWatched ? (
          <>
            <X className="w-4 h-4" /> Remove
          </>
        ) : (
          <>
            <Film className="w-4 h-4" /> Add to Watched
          </>
        )}
      </button>
    </div>
  );

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
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchMovies()}
                placeholder="Search movies..."
                className="w-full p-3 pl-10 rounded-lg bg-gray-800 border border-gray-600 text-white transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
            </div>
            <button
              onClick={fetchMovies}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </button>
          </div>
          <button
            onClick={() => setShowWatchlist(!showWatchlist)}
            className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${
              showWatchlist
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <Film className="w-4 h-4" />
            {showWatchlist ? "Show Search" : "Show Watchlist"}
          </button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {showWatchlist ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-purple-400 flex items-center gap-2">
              <Film className="w-6 h-6" /> My Watchlist ({watchedMovies.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {watchedMovies.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 py-12">
                  Your watchlist is empty. Start adding some movies!
                </div>
              ) : (
                watchedMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isWatched={true}
                    onAction={handleRemoveFromWatched}
                  />
                ))
              )}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Searching for movies...</p>
              </div>
            ) : movies.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-12">
                {search.trim() ? "No movies found." : "Start searching for movies!"}
              </div>
            ) : (
              movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isWatched={watchedMovies.some((m) => m.id === movie.id)}
                  onAction={handleAddToWatched}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDiary;
