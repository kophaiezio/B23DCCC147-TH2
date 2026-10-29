import { addBook, getBooks, removeBook, saveInitialBooks } from "./books-api.js";
import { readFavorites, saveFavorites } from "./storage.js";

const currentYear = new Date().getFullYear();
const grid = document.querySelector("#book-grid");
const statusLine = document.querySelector("#status-line");
const favoriteCount = document.querySelector("#favorite-count");
const bookTotal = document.querySelector("#book-total");
const searchInput = document.querySelector("#search-input");
const genreFilter = document.querySelector("#genre-filter");
const form = document.querySelector("#book-form");
const themeToggle = document.querySelector("#theme-toggle");
form.elements.year.max = String(currentYear);
let books = [];
let favorites = readFavorites();

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function renderGenres() {
  const selectedGenre = genreFilter.value;
  const genres = [...new Set(books.map((book) => book.genre))].sort((a, b) => a.localeCompare(b, "vi"));
  genreFilter.replaceChildren(new Option("Tất cả thể loại", "all"));

  for (const genre of genres) genreFilter.add(new Option(genre, genre));
  genreFilter.value = genres.includes(selectedGenre) ? selectedGenre : "all";

  const genreField = form.elements.genre;
  const selectedFormGenre = genreField.value;
  genreField.replaceChildren(new Option("Chọn thể loại", ""));
  for (const genre of genres) genreField.add(new Option(genre, genre));
  genreField.value = genres.includes(selectedFormGenre) ? selectedFormGenre : "";
}

function renderBookCard(book) {
  const card = createTextElement("article", "book-card", "");
  const content = createTextElement("div", "book-content", "");
  content.append(createTextElement("h3", "book-title", book.title));
  content.append(createTextElement("p", "book-author", `bởi ${book.author}`));
  content.append(createTextElement("p", "book-genre", `Thể loại: ${book.genre}`));
  const details = createTextElement("p", "book-year", `Xuất bản năm ${book.year}`);
  const actions = createTextElement("div", "card-actions", "");
  const favoriteButton = createTextElement("button", "favorite-button", favorites.includes(book.id) ? "♥ Đã thích" : "♡ Yêu thích");
  favoriteButton.type = "button";
  favoriteButton.dataset.action = "favorite";
  favoriteButton.dataset.id = book.id;
  favoriteButton.setAttribute("aria-pressed", String(favorites.includes(book.id)));
  const deleteButton = createTextElement("button", "delete-button", "Xóa");
  deleteButton.type = "button";
  deleteButton.dataset.action = "delete";
  deleteButton.dataset.id = book.id;
  actions.append(favoriteButton, deleteButton);
  content.append(details, actions);
  card.append(content);
  return card;
}

function renderBooks() {
  const query = searchInput.value.trim().toLocaleLowerCase("vi");
  const selectedGenre = genreFilter.value;
  const visibleBooks = books.filter((book) => {
    const matchesTitle = book.title.toLocaleLowerCase("vi").includes(query);
    const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;
    return matchesTitle && matchesGenre;
  });

  grid.replaceChildren(...visibleBooks.map(renderBookCard));
  statusLine.textContent = `Đang hiển thị ${visibleBooks.length} / ${books.length} cuốn`;
  bookTotal.textContent = `${books.length} cuốn sách`;
  favoriteCount.textContent = String(favorites.filter((id) => books.some((book) => book.id === id)).length);
  renderGenres();
}

function validateField(field) {
  const value = field.value.trim();
  let message = "";

  if (field.name === "title" && value.length < 3) message = "Tên sách cần có ít nhất 3 ký tự.";
  if (field.name === "author" && value.length === 0) message = "Vui lòng nhập tên tác giả.";
  if (field.name === "genre" && value.length === 0) message = "Vui lòng chọn hoặc nhập thể loại.";
  if (field.name === "year") {
    const year = Number(value);
    if (!value || !Number.isInteger(year) || year < 1900 || year > currentYear) {
      message = `Năm xuất bản phải từ 1900 đến ${currentYear}.`;
    }
  }

  const error = document.querySelector(`#${field.name}-error`);
  error.textContent = message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
  return message === "";
}

function updateTheme(isDark) {
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeToggle.textContent = isDark ? "☀" : "☾";
  themeToggle.setAttribute("aria-label", isDark ? "Bật giao diện sáng" : "Bật giao diện tối");
  localStorage.setItem("mam-doc-theme", isDark ? "dark" : "light");
}

grid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button || !grid.contains(button)) return;

  if (button.dataset.action === "favorite") {
    const id = button.dataset.id;
    favorites = favorites.includes(id) ? favorites.filter((favorite) => favorite !== id) : [...favorites, id];
    saveFavorites(favorites);
    renderBooks();
    return;
  }

  if (button.dataset.action === "delete") {
    const book = books.find((item) => item.id === button.dataset.id);
    if (!book || !window.confirm(`Bạn có chắc muốn xóa “${book.title}” khỏi tủ sách?`)) return;

    try {
      const updatedBooks = removeBook(book.id, books);
      const updatedFavorites = favorites.filter((id) => id !== book.id);
      saveFavorites(updatedFavorites);
      books = updatedBooks;
      favorites = updatedFavorites;
      renderBooks();
    } catch (error) {
      console.error("Không thể xóa sách:", error);
      statusLine.textContent = `Không thể xóa sách: ${error.message}`;
    }
  }
});

searchInput.addEventListener("input", renderBooks);
genreFilter.addEventListener("change", renderBooks);
form.addEventListener("input", (event) => {
  if (event.target.matches("[name]")) validateField(event.target);
});
form.addEventListener("change", (event) => {
  if (event.target.matches("[name]")) validateField(event.target);
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = [...form.querySelectorAll("[name]")];
  const valid = fields.map(validateField).every(Boolean);
  if (!valid) {
    fields.find((field) => field.getAttribute("aria-invalid") === "true")?.focus();
    return;
  }

  const formData = new FormData(form);
  const book = {
    id: `book-${crypto.randomUUID()}`,
    title: String(formData.get("title")).trim(),
    author: String(formData.get("author")).trim(),
    genre: String(formData.get("genre")).trim(),
    year: Number(formData.get("year")),
  };
  try {
    books = addBook(book);
  } catch (error) {
    console.error("Không thể lưu sách:", error);
    statusLine.textContent = `Không thể lưu sách: ${error.message}`;
    return;
  }
  form.reset();
  form.querySelectorAll("[name]").forEach((field) => {
    field.removeAttribute("aria-invalid");
    document.querySelector(`#${field.name}-error`).textContent = "";
  });
  genreFilter.value = "all";
  searchInput.value = "";
  renderBooks();
  statusLine.textContent = `Đã thêm “${book.title}” vào tủ sách. Đang hiển thị ${books.length} / ${books.length} cuốn`;
});

themeToggle.addEventListener("click", () => updateTheme(document.documentElement.dataset.theme !== "dark"));

const savedTheme = localStorage.getItem("mam-doc-theme");
updateTheme(savedTheme === "dark");

async function initialize() {
  statusLine.textContent = "Đang tải…";
  try {
    books = await getBooks();
    saveInitialBooks(books);
    renderGenres();
    renderBooks();
  } catch (error) {
    console.error("Không thể tải danh sách sách:", error);
    statusLine.textContent = `Không thể tải sách: ${error.message}`;
    grid.replaceChildren();
  }
}

initialize();
