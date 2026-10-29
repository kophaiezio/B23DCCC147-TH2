import React from "react";

export default function BookCard({ book, isFavorite, onToggleFavorite, onDelete }) {
  return (
    <article className="book-card">
      <div className="book-content">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">bởi {book.author}</p>
        <p className="book-genre">Thể loại: {book.genre}</p>
        <p className="book-year">Xuất bản năm {book.year}</p>
        <div className="card-actions">
          <button
            className={`favorite-button${isFavorite ? " is-favorite" : ""}`}
            type="button"
            aria-pressed={isFavorite}
            onClick={() => onToggleFavorite(book.id)}
          >
            {isFavorite ? "♥ Đã thích" : "♡ Yêu thích"}
          </button>
          <button className="delete-button" type="button" onClick={() => onDelete(book.id)}>Xóa</button>
        </div>
      </div>
    </article>
  );
}
