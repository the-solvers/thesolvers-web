import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SolutionsGrid from '@/components/SolutionsGrid';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SolutionsGrid />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
