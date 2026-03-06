import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import logo from "../assets/logo.png";
import useAuthState from "../hooks/useAuthState";
import { auth } from "../lib/firebase";
import { clearSession } from "../lib/authSession";
import { ROUTES } from "../lib/routes";

function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuValue, setMobileMenuValue] = useState("");
  const { isAuthenticated, isService } = useAuthState();

  const publicLinks = [
    { to: ROUTES.docs, label: "Docs" },
    { to: ROUTES.contact, label: "Contact" },
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

  async function handleMobileMenuChange(event) {
    const nextValue = event.target.value;
    setMobileMenuValue(nextValue);

    if (!nextValue) {
      return;
    }

    if (nextValue === "__logout") {
      await handleLogout();
      navigate(ROUTES.home, { replace: true });
      setMobileMenuValue("");
      return;
    }

    navigate(nextValue);
    setMobileMenuValue("");
  }

  return (
    <header className="top-nav">
      <NavLink to={ROUTES.home} className="brand" end>
        <img src={logo} alt="Algo Arena logo" className="brand-logo" />
        <span>Algo Arena</span>
      </NavLink>
      <nav className="nav-public">
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
      <nav className="nav-app desktop-only">
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
      <div className="nav-app-mobile">
        <select
          className="nav-more-select"
          aria-label="More navigation links"
          value={mobileMenuValue}
          onChange={handleMobileMenuChange}
        >
          <option value="">More</option>
          {appLinks.map((link) => (
            <option key={link.to} value={link.to}>
              {link.label}
            </option>
          ))}
          {serviceLinks.map((link) => (
            <option key={link.to} value={link.to}>
              {link.label}
            </option>
          ))}
          {isAuthenticated ? <option value="__logout">Logout</option> : null}
        </select>
      </div>
    </header>
  );
}

export default Navbar;
