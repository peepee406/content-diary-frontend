import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);

  return (
    <div>
      <h1>My Content Diary</h1>
    </div>
  );
}
