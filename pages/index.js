import { useState } from "react";
import axios from "axios";

export default function Home() {
    const [search, setSearch] = useState("");
    const [movies, setMovies] = useState([]);

    const fetchMovies = async () => {
        if (!search.trim()) return; // Prevent empty searches

        try {
            const options = {
                method: 'GET',
                url: 'https://imdb236.p.rapidapi.com/imdb/tt7631058/cast',
                params: { q: search },
                headers: {
                    'X-RapidAPI-Key': 'afd3c2c3ecmsh9ee5e2625c76f34p1e46cfjsn9ae85215c63b',  // Replace this
                    'X-RapidAPI-Host': 'imdb236.p.rapidapi.com'
                }
            };

            const response = await axios.request(options);
            setMovies(response.data.d || []);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-3xl text-center mb-4">Content Diary</h1>
            <div className="flex justify-center mb-4">
                <input
                    type="text"
                    placeholder="Search movies, anime, series..."
                    className="p-2 rounded-lg text-black"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button 
                    className="ml-2 px-4 py-2 bg-blue-600 rounded-lg"
                    onClick={fetchMovies}
                >
                    Search
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movies.map((movie) => (
                    <div key={movie.id} className="bg-gray-800 p-4 rounded-lg">
                        <img src={movie.i?.imageUrl} alt={movie.l} className="w-full h-40 object-cover rounded" />
                        <h2 className="text-lg mt-2">{movie.l}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}
