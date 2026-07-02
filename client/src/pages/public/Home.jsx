import Navbar             from '../../components/layout/Navbar.jsx';
import Footer             from '../../components/layout/Footer.jsx';
import Hero               from '../../components/sections/Hero.jsx';
import TestimonialSlider  from '../../components/sections/TestimonialSlider.jsx';
import About              from '../../components/sections/About.jsx';
import Services           from '../../components/sections/Services.jsx';
import WhyChooseUs        from '../../components/sections/WhyChooseUs.jsx';
import Testimonials       from '../../components/sections/Testimonials.jsx';
import FAQ                from '../../components/sections/FAQ.jsx';
import Contact            from '../../components/sections/Contact.jsx';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TestimonialSlider />
        <About />
        <Services />
        <WhyChooseUs />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
