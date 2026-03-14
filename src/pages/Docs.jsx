import { useEffect, useRef, useState } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import { Navigate, NavLink, useLocation, useParams } from "react-router-dom";
import PageShell from "../components/PageShell";
import { ROUTES } from "../lib/routes";
import {
  DEFAULT_DOC_SECTION,
  DOC_ENVIRONMENT_LINKS,
  DOC_NAV_GROUPS,
} from "./docs/config";
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
  const isEnvironmentDocs =
    location.pathname === ROUTES.docsSection("environments") ||
    location.pathname.startsWith("/docs/environments/");
  const mainRef = useRef(null);
  const [isMainScrollable, setIsMainScrollable] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEnvironmentExpanded, setIsEnvironmentExpanded] =
    useState(isEnvironmentDocs);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [tocItems, setTocItems] = useState([]);

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

  useEffect(() => {
    if (isEnvironmentDocs) {
      setIsEnvironmentExpanded(true);
      return;
    }

    setIsEnvironmentExpanded(false);
  }, [isEnvironmentDocs, environmentName, activeSection]);

  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) {
      return undefined;
    }

    const updateBackToTop = () => {
      const scrollTop = isMainScrollable
        ? mainEl.scrollTop
        : window.scrollY || window.pageYOffset || 0;
      setShowBackToTop(scrollTop > 200);
    };

    updateBackToTop();

    if (isMainScrollable) {
      mainEl.addEventListener("scroll", updateBackToTop, { passive: true });
    } else {
      window.addEventListener("scroll", updateBackToTop, { passive: true });
    }

    return () => {
      if (isMainScrollable) {
        mainEl.removeEventListener("scroll", updateBackToTop);
      } else {
        window.removeEventListener("scroll", updateBackToTop);
      }
    };
  }, [isMainScrollable]);

  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) {
      return;
    }

    const headings = Array.from(mainEl.querySelectorAll("h2, h3"));
    const usedIds = new Set();

    headings.forEach((heading) => {
      if (heading.id) {
        usedIds.add(heading.id);
      }
    });

    const items = headings
      .map((heading, index) => {
        const label = heading.textContent?.trim();
        if (!label) {
          return null;
        }

        const level = heading.tagName === "H3" ? 3 : 2;
        let id = heading.id;

        if (!id) {
          const base = label
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "");

          let unique = base || `section-${index + 1}`;
          let counter = 2;

          while (usedIds.has(unique)) {
            unique = `${base || "section"}-${counter}`;
            counter += 1;
          }

          heading.id = unique;
          id = unique;
          usedIds.add(unique);
        }

        return { id, label, level };
      })
      .filter(Boolean);

    setTocItems(items);
  }, [activeSection, environmentName]);

  const scrollToHeading = (id) => {
    const mainEl = mainRef.current;
    if (!mainEl || !id) {
      return;
    }

    const safeId = window.CSS?.escape ? window.CSS.escape(id) : id;
    const target = mainEl.querySelector(`#${safeId}`);
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const closeSidebarIfMobile = () => {
    if (window.matchMedia("(max-width: 900px)").matches) {
      setIsSidebarOpen(false);
    }
  };

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
        <button
          type="button"
          className="docs-sidebar-toggle"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          aria-expanded={isSidebarOpen}
          aria-controls="docs-sidebar-nav"
        >
          {isSidebarOpen ? "Close docs menu" : "Docs menu"}
        </button>
        <aside
          className={`docs-sidebar${isSidebarOpen ? " is-open" : ""}`}
          aria-label="Docs navigation"
        >
          <nav id="docs-sidebar-nav">
            <ul className="docs-sidebar-list">
              <li>
                <NavLink
                  to={ROUTES.docsSection("algo-arena")}
                  className={({ isActive }) =>
                    isActive ? "docs-sidebar-root active" : "docs-sidebar-root"
                  }
                  onClick={closeSidebarIfMobile}
                  end
                >
                  Algo Arena
                </NavLink>
              </li>

              {DOC_NAV_GROUPS.map((group) => (
                <li key={group.label} className="docs-sidebar-group">
                  <p className="docs-sidebar-group-label">{group.label}</p>
                  <ul className="docs-sidebar-sublist">
                    {group.sections.map((docSection) => {
                      const isEnvironmentSection =
                        docSection.key === "environments";
                      const isExpanded =
                        isEnvironmentSection && isEnvironmentExpanded;

                      return (
                        <li key={docSection.key}>
                          <NavLink
                            to={ROUTES.docsSection(docSection.key)}
                            className={({ isActive }) => {
                              if (docSection.key === "environments") {
                                return isEnvironmentDocs ? "active" : "";
                              }

                              return isActive ? "active" : "";
                            }}
                            data-expandable={isEnvironmentSection || undefined}
                            data-expanded={isExpanded || undefined}
                            aria-expanded={
                              isEnvironmentSection ? isExpanded : undefined
                            }
                            onClick={() => {
                              if (isEnvironmentSection) {
                                setIsEnvironmentExpanded((prev) => !prev);
                                return;
                              }
                              closeSidebarIfMobile();
                            }}
                            end
                          >
                            <span
                              className="docs-sidebar-icon"
                              aria-hidden="true"
                            >
                              {isEnvironmentSection && isExpanded ? (
                                <FaAngleDown />
                              ) : (
                                <FaAngleRight />
                              )}
                            </span>
                            {docSection.label}
                          </NavLink>
                          {isEnvironmentSection && (
                            <ul
                              className={`docs-sidebar-subsections${
                                isExpanded ? " is-open" : ""
                              }`}
                              aria-hidden={!isExpanded}
                            >
                              {DOC_ENVIRONMENT_LINKS.map((envLink) => (
                                <li key={envLink.key}>
                                  <NavLink
                                    to={ROUTES.docsEnvironment(envLink.key)}
                                    className={({ isActive }) =>
                                      isActive ? "active" : ""
                                    }
                                    onClick={closeSidebarIfMobile}
                                    end
                                  >
                                    <span
                                      className="docs-sidebar-icon"
                                      aria-hidden="true"
                                    >
                                      <FaAngleRight />
                                    </span>
                                    {envLink.label}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
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
          {tocItems.length > 1 && (
            <aside className="docs-toc" aria-label="On this page">
              <p className="docs-toc-title">On this page</p>
              <ul className="docs-toc-list">
                {tocItems.map((item) => (
                  <li
                    key={item.id}
                    className={
                      item.level === 3 ? "docs-toc-item is-sub" : "docs-toc-item"
                    }
                  >
                    <button
                      type="button"
                      onClick={() => scrollToHeading(item.id)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          )}
          <ActiveSection />
        </main>
        <button
          type="button"
          className={`docs-back-to-top${
            showBackToTop ? " is-visible" : ""
          }`}
          onClick={() => {
            const mainEl = mainRef.current;
            if (mainEl && isMainScrollable) {
              mainEl.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          aria-label="Back to top"
        >
          Back to top
        </button>
      </div>
    </PageShell>
  );
}

export default Docs;
