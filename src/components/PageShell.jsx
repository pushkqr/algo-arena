function PageShell({ title, subtitle, children }) {
  return (
    <section className="page-card">
      <header className="page-header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>
      {children}
    </section>
  );
}

export default PageShell;
