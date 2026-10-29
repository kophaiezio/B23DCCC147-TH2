import React from "react";

export default function Header({ favoriteCount }) {
  return (
    <header className="site-header">
      <h1 className="brand">Thư viện lớp học</h1>
      <p className="favorite-summary"><span aria-hidden="true">♥</span> {favoriteCount} yêu thích</p>
    </header>
  );
}
