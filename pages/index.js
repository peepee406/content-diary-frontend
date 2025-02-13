import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
    const [search, setSearch] = useState("");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [watchedMovies, setWatchedMovies] = useState([]);

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

        try {
            const options = {
                method: 'GET',
                url: 'https://imdb-com.p.rapidapi.com/search',
                params: { searchTerm: search },
                headers: {
                    'x-rapidapi-host': 'imdb-com.p.rapidapi.com',
                    'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
                },
            };

            const response = await axios.request(options);
            
            console.log("API Response:", response.data);

            if (response.data && response.data.data && response.data.data.mainSearch.edges) {
                const formattedMovies = response.data.data.mainSearch.edges.map((item) => {
                    const entity = item.node?.entity;
                    return {
                        id: entity?.id || "N/A",
                        title: entity?.titleText?.originalTitleText?.text || entity?.titleText?.text || "Unknown Title",
                        image: entity?.primaryImage?.url || "https://via.placeholder.com/150",
                    };
                });

                setMovies(formattedMovies);
            } else {
                setMovies([]);
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToWatched = (movie) => {
        if (!watchedMovies.some((m) => m.id === movie.id)) {
            const updatedList = [...watchedMovies, movie];
            setWatchedMovies(updatedList);
        }
    };

    const handleRemoveFromWatched = (movie) => {
        const updatedList = watchedMovies.filter((m) => m.id !== movie.id);
        setWatchedMovies(updatedList);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
            <h1 className="text-3xl font-bold mb-6">Movie Watchlist</h1>

            {/* Search Bar */}
            <div className="flex space-x-2 mb-6">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search movies..."
                    className="p-2 rounded bg-gray-800 border border-gray-600 text-white w-64"
                />
                <button
                    onClick={fetchMovies}
                    className="p-2 bg-blue-600 rounded text-white hover:bg-blue-700"
                >
                    Search
                </button>
            </div>

            {/* Loading and No Results Messages */}
            {loading && <p className="text-center text-gray-400 mt-4">Loading...</p>}
            {movies.length === 0 && !loading && (
                <p className="text-center text-gray-400 mt-4">No movies found.</p>
            )}

            {/* Movie Search Results */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movies.map((movie) => (
                    <div key={movie.id} className="bg-gray-800 p-4 rounded-lg">
                        <img 
                            src={movie.image} 
                            alt={movie.title} 
                            className="w-full h-56 object-cover rounded" 
                        />
                        <h2 className="text-lg mt-2">{movie.title}</h2>
                        <button
                            onClick={() => handleAddToWatched(movie)}
                            className={`mt-2 p-1 rounded text-white ${
                                watchedMovies.some((m) => m.id === movie.id) ? "bg-gray-600" : "bg-green-600 hover:bg-green-700"
                            }`}
                            disabled={watchedMovies.some((m) => m.id === movie.id)}
                        >
                            {watchedMovies.some((m) => m.id === movie.id) ? "Added" : "Add to Watched"}
                        </button>
                    </div>
                ))}
            </div>

            {/* Watched Movies Section */}
            <h2 className="text-2xl font-bold mt-8 mb-4">Watched Movies</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {watchedMovies.map((movie) => (
                    <div key={movie.id} className="bg-gray-800 p-4 rounded-lg">
                        <img 
                            src={movie.image} 
                            alt={movie.title} 
                            className="w-full h-56 object-cover rounded" 
                        />
                        <h2 className="text-lg mt-2">{movie.title}</h2>
                        <button
                            onClick={() => handleRemoveFromWatched(movie)}
                            className="mt-2 p-1 bg-red-600 rounded text-white hover:bg-red-700"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
            }
