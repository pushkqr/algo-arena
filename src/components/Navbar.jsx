import { NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import logo from "../assets/logo.png";
import useAuthState from "../hooks/useAuthState";
import { auth } from "../lib/firebase";
import { clearSession } from "../lib/authSession";
import { ROUTES } from "../lib/routes";

function Navbar() {
  const { isAuthenticated, isService } = useAuthState();

  const publicLinks = [
    { to: ROUTES.about, label: "About" },
    { to: ROUTES.tech, label: "Tech" },
  ];

  if (!isAuthenticated) {
    publicLinks.push({ to: ROUTES.login, label: "Login" });
  }

  const appLinks = [
    { to: ROUTES.app.strategies, label: "Strategies" },
    { to: ROUTES.app.results, label: "My Results" },
    { to: ROUTES.app.leaderboard, label: "Leaderboard" },
    { to: ROUTES.app.profile, label: "Profile" },
  ];

  const serviceLinks = isService
    ? [{ to: ROUTES.app.serviceEvaluations, label: "Service" }]
    : [];

  async function handleLogout() {
    if (auth) {
      await signOut(auth);
    }
    clearSession();
  }

  return (
    <header className="top-nav">
      <NavLink to={ROUTES.home} className="brand" end>
        <img src={logo} alt="Algo Arena logo" className="brand-logo" />
        <span>Algo Arena</span>
      </NavLink>
      <nav>
        <ul className="nav-list">
          {publicLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => (isActive ? "active" : "")}
                end
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <nav>
        <ul className="nav-list">
          {appLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          {serviceLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          {isAuthenticated && (
            <li>
              <button className="link-button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
