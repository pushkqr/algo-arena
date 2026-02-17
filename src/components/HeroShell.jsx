function HeroShell({ shellClassName = "", contentClassName = "", children }) {
  const shellClass = ["landing-shell", shellClassName]
    .filter(Boolean)
    .join(" ");
  const contentClass = ["landing-content", contentClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={shellClass}>
      <div className="landing-bg" aria-hidden="true">
        <span className="grid-overlay" />
        <span className="glow one" />
        <span className="glow two" />
        <span className="glow three" />
      </div>

      <div className={contentClass}>{children}</div>
    </section>
  );
}

export default HeroShell;
