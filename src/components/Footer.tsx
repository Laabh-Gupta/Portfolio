import { ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer container">
      <Link to="/" className="footer-brand">
        laabh<span>.</span>
      </Link>
      <p>
        © {new Date().getFullYear()} Laabh Gupta <span>·</span> Thoughtfully engineered.
      </p>
      <a href="#top">
        Back to top <ArrowUp size={14} />
      </a>
    </footer>
  );
}
