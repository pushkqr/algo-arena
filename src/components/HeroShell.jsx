import FloatingLines from "./FloatingLines";

const HERO_FLOATING_WAVES = ["top", "middle", "bottom"];

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
        <FloatingLines
          enabledWaves={HERO_FLOATING_WAVES}
          // Array - specify line count per wave; Number - same count for all waves
          lineCount={5}
          // Array - specify line distance per wave; Number - same distance for all waves
          lineDistance={5}
          bendRadius={5}
          bendStrength={-0.5}
          parallax={true}
        />
      </div>

      <div className={contentClass}>{children}</div>
    </section>
  );
}

export default HeroShell;
