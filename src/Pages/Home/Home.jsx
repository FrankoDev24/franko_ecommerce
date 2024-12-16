import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
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
      <Helmet>
        <title>Franko Trading | Home</title>
        <meta
          name="description"
          content="Explore Franko Trading for top-quality electronics, mobile phones, laptops, and accessories in Ghana. Great deals, fast shipping, and excellent customer service."
        />
        <meta
          name="keywords"
          content="Franko Trading, electronics, mobile phones, laptops, Ghana, affordable electronics, quality gadgets"
        />
        <meta name="author" content="Franko Trading Enterprise" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Franko Trading | Home" />
        <meta
          property="og:description"
          content="Find the best deals on electronics, mobile phones, laptops, and accessories at Franko Trading."
        />
        <meta property="og:image" content="link_to_image.jpg" />
        <meta property="og:url" content="https://www.frankotrading.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Franko Trading | Home" />
        <meta
          name="twitter:description"
          content="Discover the best electronics and gadgets at Franko Trading, Ghana's top choice for affordable tech."
        />
        <meta name="twitter:image" content="link_to_image.jpg" />
      </Helmet>

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
