import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Download, Menu, X } from 'lucide-react';
import { Dialog } from '@base-ui/react/dialog';
import { personal } from '../data/portfolio';

const links = ['Projects', 'Experience', 'About', 'Skills', 'Contact'];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const [compact, setCompact] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname !== '/') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-12% 0px -65% 0px' },
    );
    document.querySelectorAll('section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname]);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setCompact(!entry.isIntersecting));
    const top = document.getElementById('top');
    if (top) observer.observe(top);
    const query = matchMedia('(min-width: 901px)');
    const close = () => {
      if (query.matches) setOpen(false);
    };
    query.addEventListener('change', close);
    return () => {
      observer.disconnect();
      query.removeEventListener('change', close);
    };
  }, []);
  const navLinks = links.map((label, index) => {
    const id = label.toLowerCase();
    const selected = location.pathname === '/' ? active === id : id === 'projects';
    return (
      <Link
        key={id}
        to={`/#${id}`}
        aria-current={selected ? 'location' : undefined}
        onClick={() => setOpen(false)}
      >
        <span className="mobile-nav-number" aria-hidden="true">
          0{index + 1}
        </span>
        {label}
        <ArrowUpRight className="mobile-nav-arrow" aria-hidden="true" size={22} />
      </Link>
    );
  });
  return (
    <header className={`site-header ${compact ? 'is-compact' : ''}`}>
      <nav className="navbar container" aria-label="Main navigation">
        <Link to="/" className="brand" aria-label="Laabh Gupta home">
          <span className="brand-mark">
            lg<span>.</span>
          </span>
          <span className="brand-name">Laabh Gupta</span>
        </Link>
        <div className="desktop-links">{navLinks}</div>
        <a className="nav-resume text-link" href={personal.resume} download>
          Resume <Download size={15} />
        </a>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger className="icon-button mobile-toggle" aria-label="Open navigation">
            <Menu size={22} />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop className="dialog-backdrop" />
            <Dialog.Popup className="mobile-menu" data-lenis-prevent>
              <div className="mobile-menu-heading">
                <Dialog.Title>Explore the portfolio</Dialog.Title>
                <Dialog.Close className="icon-button" aria-label="Close navigation">
                  <X />
                </Dialog.Close>
              </div>
              <Dialog.Description className="sr-only">
                Navigate Laabh Gupta’s portfolio.
              </Dialog.Description>
              <div className="mobile-links">{navLinks}</div>
              <a
                className="button button-primary"
                href={personal.resume}
                download
                onClick={() => setOpen(false)}
              >
                Download resume <Download size={17} />
              </a>
              <a className="mobile-email" href={`mailto:${personal.email}`}>
                {personal.email}
                <ArrowUpRight size={16} />
              </a>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </nav>
    </header>
  );
}
