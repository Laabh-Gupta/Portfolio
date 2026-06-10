import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/projects", label: "Projects" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <Link to="/" className="nav-logo">laabh<span>.dev</span></Link>
      <ul className={`nav-links${menuOpen ? " open" : ""}`}>
        {links.map(l => (
          <li key={l.to}>
            <Link to={l.to} className={location.pathname === l.to ? "active" : ""}>
              {l.label}
            </Link>
          </li>
        ))}
        <li>
          <a
            href="/Laabh_Gupta.pdf"
            download
            className="nav-resume-btn"
          >
            ↓ Resume
          </a>
        </li>
      </ul>
      <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
        <span /><span /><span />
      </button>
    </nav>
  );
}
