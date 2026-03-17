import { Suspense, lazy } from "react";

const FloatingLines = lazy(() => import("./FloatingLines"));

const HERO_FLOATING_WAVES = ["top", "middle", "bottom"];
const HERO_FLOATING_GRADIENT = ["#2f4ba2", "#6366f1", "#e947f5"];

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
        <Suspense fallback={null}>
          <FloatingLines
            enabledWaves={HERO_FLOATING_WAVES}
            linesGradient={HERO_FLOATING_GRADIENT}
            lineCount={5}
            lineDistance={5}
            bendRadius={5}
            bendStrength={-0.5}
            mixBlendMode="screen"
            parallax={true}
          />
        </Suspense>
        <span className="landing-bg-overlay" />
      </div>

      <div className={contentClass}>{children}</div>
    </section>
  );
}

export default HeroShell;
