import { lazy, Suspense } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { domAnimation, LazyMotion, MotionConfig } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageBehavior from './components/PageBehavior';
import Home from './pages/Home';
import MagneticCursor from './components/MagneticCursor';
import FlowField from './components/FlowField';
import { useScrollRestoration } from './components/useScrollRestoration';

const ProjectCaseStudy = lazy(() => import('./pages/ProjectCaseStudy'));

function RouteScroll() {
  useScrollRestoration();
  return null;
}

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div id="top" tabIndex={-1} />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <FlowField />
        <Navbar />
        <PageBehavior />
        <MagneticCursor />
        <main id="main" tabIndex={-1}>
          <Suspense
            fallback={
              <div className="container route-loading" role="status">
                Loading case study…
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/argulab" element={<ProjectCaseStudy />} />
              <Route path="/about" element={<Navigate replace to="/#about" />} />
              <Route path="/projects" element={<Navigate replace to="/#projects" />} />
              <Route path="/contact" element={<Navigate replace to="/#contact" />} />
              <Route path="/GetInTouch" element={<Navigate replace to="/#contact" />} />
              <Route
                path="*"
                element={
                  <div className="not-found container">
                    <p className="eyebrow">404 / PAGE NOT FOUND</p>
                    <h1>That path ends here.</h1>
                    <p>The projects and engineering stories are one click away.</p>
                    <Link to="/" className="button button-primary">
                      Return to portfolio
                    </Link>
                  </div>
                }
              />
            </Routes>
            <RouteScroll />
          </Suspense>
        </main>
        <Footer />
      </MotionConfig>
    </LazyMotion>
  );
}
