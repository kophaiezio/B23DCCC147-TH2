import React from "react";

export default function GenreFilter({ genres, selectedGenre, onSelect }) {
  return (
    <div className="genre-filter" aria-label="Lọc sách theo thể loại">
      <button
        className="genre-button"
        type="button"
        aria-pressed={selectedGenre === "all"}
        onClick={() => onSelect("all")}
      >
        Tất cả
      </button>
      {genres.map((genre) => (
        <button
          className="genre-button"
          type="button"
          aria-pressed={selectedGenre === genre}
          key={genre}
          onClick={() => onSelect(genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
