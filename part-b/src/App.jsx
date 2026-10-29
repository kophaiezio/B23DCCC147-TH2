import React, { useMemo, useState } from "react";
import booksData from "./data/books.js";
import BookList from "./components/BookList.jsx";
import Footer from "./components/Footer.jsx";
import GenreFilter from "./components/GenreFilter.jsx";
import Header from "./components/Header.jsx";
import Section from "./components/Section.jsx";

const currentYear = new Date().getFullYear();
const emptyForm = { title: "", author: "", genre: "", year: "" };

function getFieldError(name, value) {
  const trimmed = value.trim();
  if (name === "title" && trimmed.length < 3) return "Tên sách cần có ít nhất 3 ký tự.";
  if (name === "author" && !trimmed) return "Vui lòng nhập tên tác giả.";
  if (name === "genre" && !trimmed) return "Vui lòng nhập thể loại.";
  if (name === "year") {
    const year = Number(trimmed);
    if (!trimmed || !Number.isInteger(year) || year < 1900 || year > currentYear) {
      return `Năm xuất bản phải từ 1900 đến ${currentYear}.`;
    }
  }
  return "";
}

function App() {
  const [books, setBooks] = useState(booksData);
  const [favorites, setFavorites] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const genres = useMemo(() => [...new Set(books.map((book) => book.genre))].sort((a, b) => a.localeCompare(b, "vi")), [books]);
  const visibleBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi");
    return books.filter((book) => {
      const matchesTitle = book.title.toLocaleLowerCase("vi").includes(normalizedQuery);
      return matchesTitle && (selectedGenre === "all" || book.genre === selectedGenre);
    });
  }, [books, query, selectedGenre]);

  function toggleFavorite(id) {
    setFavorites((current) => current.includes(id) ? current.filter((favorite) => favorite !== id) : [...current, id]);
  }

  function deleteBook(id) {
    const book = books.find((item) => item.id === id);
    if (!book || !window.confirm(`Bạn có chắc muốn xóa “${book.title}” khỏi tủ sách?`)) return;
    setBooks((current) => current.filter((item) => item.id !== id));
    setFavorites((current) => current.filter((favorite) => favorite !== id));
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setTouched((current) => ({ ...current, [name]: true }));
  }

  function addBook(event) {
    event.preventDefault();
    setSubmitted(true);
    const errors = Object.keys(emptyForm).map((name) => getFieldError(name, form[name]));
    if (errors.some(Boolean)) return;

    const book = {
      id: `react-${crypto.randomUUID()}`,
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre.trim(),
      year: Number(form.year),
    };
    setBooks((current) => [book, ...current]);
    setSelectedGenre("all");
    setQuery("");
    setForm(emptyForm);
    setTouched({});
    setSubmitted(false);
  }

  function fieldError(name) {
    return (touched[name] || submitted) ? getFieldError(name, form[name]) : "";
  }

  return (
    <div className="page-shell">
      <Header favoriteCount={favorites.filter((id) => books.some((book) => book.id === id)).length} />
      <main>
        <section className="intro" aria-labelledby="page-title">
          <h2 id="page-title">Quản lý danh sách sách</h2>
          <p className="intro-copy">Tìm sách, lọc theo thể loại hoặc thêm sách mới vào thư viện.</p>
        </section>

        <Section
          title="Tủ sách của lớp"
          action={<span className="book-count">{books.length} cuốn sách</span>}
        >
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm tên sách..."
              aria-label="Tìm tên sách"
            />
          </label>
          <GenreFilter genres={genres} selectedGenre={selectedGenre} onSelect={setSelectedGenre} />
          <p className="status-line" role="status" aria-live="polite">
            Đang hiển thị {visibleBooks.length} / {books.length} cuốn
          </p>
          <BookList
            books={visibleBooks}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onDelete={deleteBook}
          />
        </Section>

        <Section
          title="Thêm sách mới"
        >
          <form onSubmit={addBook} noValidate>
            <div className="form-grid">
              <label className="form-field">
                <span>Tên sách</span>
                <input name="title" value={form.title} onChange={updateField} placeholder="Tên sách (ít nhất 3 ký tự)" aria-invalid={Boolean(fieldError("title"))} />
                <small className="field-error">{fieldError("title")}</small>
              </label>
              <label className="form-field">
                <span>Tác giả</span>
                <input name="author" value={form.author} onChange={updateField} placeholder="Tên tác giả" aria-invalid={Boolean(fieldError("author"))} />
                <small className="field-error">{fieldError("author")}</small>
              </label>
              <label className="form-field">
                <span>Thể loại</span>
                <select name="genre" value={form.genre} onChange={updateField} aria-invalid={Boolean(fieldError("genre"))}>
                  <option value="">Chọn thể loại</option>
                  {genres.map((genre) => <option value={genre} key={genre}>{genre}</option>)}
                </select>
                <small className="field-error">{fieldError("genre")}</small>
              </label>
              <label className="form-field">
                <span>Năm xuất bản</span>
                <input name="year" type="number" min="1900" max={currentYear} value={form.year} onChange={updateField} placeholder="2024" aria-invalid={Boolean(fieldError("year"))} />
                <small className="field-error">{fieldError("year")}</small>
              </label>
            </div>
            <div className="form-actions">
              <button className="primary-button" type="submit">Thêm vào tủ sách <span aria-hidden="true">↗</span></button>
            </div>
          </form>
        </Section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
