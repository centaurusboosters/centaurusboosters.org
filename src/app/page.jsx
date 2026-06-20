import Nav from '../components/next-sections/Nav';
import Hero from '../components/next-sections/Hero';
import About from '../components/next-sections/About';
import StatBand from '../components/next-sections/StatBand';
import Programs from '../components/next-sections/Programs';
import Footer from '../components/next-sections/Footer';

export default function Home() {
  return (
    <div id="top">
      <Nav />
      <Hero />
      <About />
      <StatBand />
      <Programs />
      <Footer />
    </div>
  );
}
