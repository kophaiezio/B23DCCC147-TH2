import React from "react";
import BookCard from "./BookCard.jsx";

export default function BookList({ books, favorites, onToggleFavorite, onDelete }) {
  if (books.length === 0) return <p className="empty-state">Chưa tìm thấy cuốn sách phù hợp. Hãy thử từ khóa khác nhé.</p>;

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          isFavorite={favorites.includes(book.id)}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
