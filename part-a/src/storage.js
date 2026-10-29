const BOOKS_KEY = "mam-doc-books-v1";
const FAVORITES_KEY = "mam-doc-favorites-v1";

export function readSavedBooks() {
  const saved = localStorage.getItem(BOOKS_KEY);
  return saved === null ? null : JSON.parse(saved);
}

export function saveBooks(books) {
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

export function readFavorites() {
  const saved = localStorage.getItem(FAVORITES_KEY);
  return saved === null ? [] : JSON.parse(saved);
}

export function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}
