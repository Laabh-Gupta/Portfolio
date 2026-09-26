import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Download, Menu, X } from 'lucide-react';
import { Dialog } from '@base-ui/react/dialog';
import { personal } from '../data/portfolio';

const links = ['About', 'Experience', 'Projects', 'Skills', 'Contact'];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const location = useLocation();
  useEffect(() => {
    if (location.pathname !== '/') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -65% 0px' },
    );
    document.querySelectorAll('section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname]);
  useEffect(() => {
    const query = window.matchMedia('(min-width: 801px)');
    const close = () => {
      if (query.matches) setOpen(false);
    };
    query.addEventListener('change', close);
    return () => query.removeEventListener('change', close);
  }, []);
  const navLinks = links.map((label) => {
    const id = label.toLowerCase();
    return (
      <Link
        key={id}
        to={`/#${id}`}
        aria-current={location.pathname === '/' && active === id ? 'location' : undefined}
        onClick={() => setOpen(false)}
      >
        {label}
      </Link>
    );
  });
  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Main navigation">
        <Link to="/" className="brand" aria-label="Laabh Gupta home">
          <span className="brand-mark">
            lg<span>.</span>
          </span>
          <span className="brand-name">
            Laabh Gupta<span className="brand-dot">.</span>
          </span>
        </Link>
        <div className="desktop-links">{navLinks}</div>
        <a className="button button-small nav-resume" href={personal.resume} download>
          <Download size={15} aria-hidden="true" />
          <span>Resume</span>
        </a>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger className="icon-button mobile-toggle" aria-label="Open navigation">
            <Menu size={21} />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop className="dialog-backdrop" />
            <Dialog.Popup className="mobile-menu" data-lenis-prevent>
              <div className="mobile-menu-heading">
                <Dialog.Title>Explore</Dialog.Title>
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
