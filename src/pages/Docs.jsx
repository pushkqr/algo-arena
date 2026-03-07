import { useEffect, useRef, useState } from "react";
import { Navigate, NavLink, useLocation, useParams } from "react-router-dom";
import PageShell from "../components/PageShell";
import { ROUTES } from "../lib/routes";
import { DEFAULT_DOC_SECTION, DOC_NAV_GROUPS } from "./docs/config";
import {
  DOC_ENVIRONMENT_COMPONENTS,
  DOC_SECTION_COMPONENTS,
} from "./docs/sections";

function Docs() {
  const { section, env } = useParams();
  const location = useLocation();
  const environmentName = typeof env === "string" ? env : "";
  const activeSection =
    section || (environmentName ? "environments" : DEFAULT_DOC_SECTION);
  const ActiveSection = environmentName
    ? DOC_ENVIRONMENT_COMPONENTS[environmentName]
    : DOC_SECTION_COMPONENTS[activeSection];
  const mainRef = useRef(null);
  const [isMainScrollable, setIsMainScrollable] = useState(false);

  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) {
      return undefined;
    }

    const updateScrollability = () => {
      const canScroll = mainEl.scrollHeight > mainEl.clientHeight + 1;
      setIsMainScrollable(canScroll);
    };

    updateScrollability();

    const resizeObserver = new ResizeObserver(updateScrollability);
    resizeObserver.observe(mainEl);

    window.addEventListener("resize", updateScrollability);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScrollability);
    };
  }, [activeSection]);

  if (environmentName && !ActiveSection) {
    return <Navigate to={ROUTES.docsSection("environments")} replace />;
  }

  if (!environmentName && !ActiveSection) {
    return <Navigate to={ROUTES.docsSection(DEFAULT_DOC_SECTION)} replace />;
  }

  return (
    <PageShell
      title="Strategy Docs"
      subtitle="User-facing guide for writing, verifying, and configuring strategies in Algo Arena."
    >
      <div
        className={
          isMainScrollable ? "docs-layout docs-layout--locked" : "docs-layout"
        }
      >
        <aside className="docs-sidebar" aria-label="Docs navigation">
          <nav>
            <ul className="docs-sidebar-list">
              <li>
                <NavLink
                  to={ROUTES.docsSection("algo-arena")}
                  className={({ isActive }) =>
                    isActive ? "docs-sidebar-root active" : "docs-sidebar-root"
                  }
                  end
                >
                  Algo Arena
                </NavLink>
              </li>

              {DOC_NAV_GROUPS.map((group) => (
                <li key={group.label} className="docs-sidebar-group">
                  <p className="docs-sidebar-group-label">{group.label}</p>
                  <ul className="docs-sidebar-sublist">
                    {group.sections.map((docSection) => (
                      <li key={docSection.key}>
                        <NavLink
                          to={ROUTES.docsSection(docSection.key)}
                          className={({ isActive }) => {
                            if (docSection.key === "environments") {
                              const inEnvironmentDocs =
                                location.pathname ===
                                  ROUTES.docsSection("environments") ||
                                location.pathname.startsWith(
                                  "/docs/environments/",
                                );
                              return inEnvironmentDocs ? "active" : "";
                            }

                            return isActive ? "active" : "";
                          }}
                          end
                        >
                          {docSection.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main
          ref={mainRef}
          className="docs-main"
          aria-label="Documentation article"
        >
          <ActiveSection />
        </main>
      </div>
    </PageShell>
  );
}

export default Docs;
