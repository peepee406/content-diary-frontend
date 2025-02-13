import { useState } from "react";
import axios from "axios";

export default function Home() {
    const [search, setSearch] = useState("");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

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
                    'x-rapidapi-key': 'afd3c2c3ecmsh9ee5e2625c76f34p1e46cfjsn9ae85215c63b' // **SECURITY RISK - DO NOT DO THIS IN PRODUCTION**
                }
            };

            const response = await axios.request(options);

            if (response.data && response.data.d) {
                const formattedMovies = response.data.d.map((item) => ({
                    id: item.id,
                    title: item.titleText?.originalTitleText?.text || "Unknown Title",
                    image: item.primaryImage?.url || "https://via.placeholder.com/150",
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

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
            <h1 className="text-3xl font-bold mb-6">Movie Search</h1>

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
                        <img
                            src={movie.image}
                            alt={movie.title}
                            className="w-full h-40 object-cover rounded"
                        />
                        <h2 className="text-lg mt-2">{movie.title}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}
