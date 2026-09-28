import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import TechStack from '../components/TechStack';
import Proof from '../components/Proof';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Experience />
      <About />
      <TechStack />
      <Proof />
      <Contact />
    </>
  );
}
