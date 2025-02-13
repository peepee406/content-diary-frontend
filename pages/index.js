import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
    const [search, setSearch] = useState("");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [watchedMovies, setWatchedMovies] = useState([]); // State for watched movies

    // Load watched movies from localStorage on mount
    useEffect(() => {
        const storedWatchedMovies = JSON.parse(localStorage.getItem("watchedMovies")) || [];
        setWatchedMovies(storedWatchedMovies);
    }, []);

    // Save watched movies to localStorage whenever it changes
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
                    'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY, // Make sure this is in your .env file
                },
            };

            const response = await axios.request(options);

            if (response.data && response.data.d) {
                const formattedMovies = response.data.d.map((item) => ({
                    id: item.id,
                    title: item.l, // Use 'l' for title
                    image: item.i?.imageUrl || "https://via.placeholder.com/150", // Use 'i.imageUrl' with optional chaining
                }));

                setMovies(formattedMovies);
            } else {
                setMovies([]);
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
            alert("Failed to fetch data. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToWatched = (movie) => {
        setWatchedMovies([...watchedMovies, movie]);
        // Optionally, you can remove the movie from the search results:
        setMovies(movies.filter((m) => m.id !== movie.id));
    };

    const handleRemoveFromWatched = (movie) => {
      setWatchedMovies(watchedMovies.filter((m) => m.id !== movie.id));
    };


    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
            <h1 className="text-3xl font-bold mb-6">Movie Watchlist</h1>

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

            {loading && <p className="text-center text-gray-400 mt-4">Loading...</p>}
            {movies.length === 0 && !loading && (
                <p className="text-center text-gray-400 mt-4">No movies found.</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movies.map((movie) => (
                    <div key={movie.id} className="bg-gray-800 p-4 rounded-lg">
                        <img src={movie.image} alt={movie.title} className="w-full h-40 object-cover rounded" />
                        <h2 className="text-lg mt-2">{movie.title}</h2>
                        <button
                            onClick={() => handleAddToWatched(movie)}
                            className="mt-2 p-1 bg-green-600 rounded text-white hover:bg-green-700"
                        >
                            Add to Watched
                        </button>
                    </div>
                ))}
            </div>

            {/* Watched Movies Section */}
            <h2 className="text-2xl font-bold mt-8 mb-4">Watched Movies</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {watchedMovies.map((movie) => (
                    <div key={movie.id} className="bg-gray-800 p-4 rounded-lg">
                        <img src={movie.image} alt={movie.title} className="w-full h-40 object-cover rounded" />
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
