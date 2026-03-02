function PageShell({ title, subtitle, children }) {
  return (
    <section className="page-card">
      <div className="page-card-bg" aria-hidden="true">
        <span className="grid-overlay" />
        <span className="glow one" />
        <span className="glow two" />
        <span className="glow three" />
      </div>

      <header className="page-header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>
      {children}
    </section>
  );
}

export default PageShell;
