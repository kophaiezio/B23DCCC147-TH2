import { readSavedBooks, saveBooks } from "./storage.js";

export async function getBooks() {
  const savedBooks = readSavedBooks();
  if (savedBooks !== null) return savedBooks;

  const response = await fetch("./books.json");
  if (!response.ok) throw new Error(`Không thể tải dữ liệu sách (HTTP ${response.status}).`);

  const books = await response.json();
  if (!Array.isArray(books)) throw new Error("Dữ liệu sách không đúng định dạng.");
  return books;
}

export function addBook(book) {
  const books = readSavedBooks();
  if (!Array.isArray(books)) throw new Error("Không thể cập nhật danh sách sách đã lưu.");
  const updatedBooks = [book, ...books];
  saveBooks(updatedBooks);
  return updatedBooks;
}

export function removeBook(id, books) {
  const updatedBooks = books.filter((book) => book.id !== id);
  saveBooks(updatedBooks);
  return updatedBooks;
}

export function saveInitialBooks(books) {
  if (readSavedBooks() === null) saveBooks(books);
}
