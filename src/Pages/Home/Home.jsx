import { useEffect } from 'react';
import ShowRoom from '../../Components/ShowRoom/ShowRoom';
import ShopByBrandsBanner from '../../Components/BrandsBanner';
import RecentProducts from '../../Components/RecentProducts';
import Header from '../../Components/Navbar/Header';
import InfoBanner from '../../Components/InfoBanner'; // Correct for default export
import Footer from '../../Components/Footer/Footer'; // Correct for default export

export default function Home() {
  useEffect(() => {
    // Scroll to top when the component is mounted
    window.scrollTo(0, 0);
  }, []); // Empty dependency array to ensure it runs only once

  return (
    <div>
      <Header />
      <ShopByBrandsBanner />
      <ShowRoom />
      <InfoBanner />
      <RecentProducts />
      <div>
        <Footer />
      </div>
    </div>
  );
}
