import React from "react";

export default function Section({ title, action, children }) {
  return (
    <section className="content-section">
      <div className="section-heading">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
