import { lazy, Suspense, useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../Components/Navbar/Header';
import Footer from '../../Components/Footer/Footer';

const ShowRoom = lazy(() => import('../../Components/ShowRoom/ShowRoom'));
const ShopByBrandsBanner = lazy(() => import('../../Components/BrandsBanner'));
const RecentProducts = lazy(() => import('../../Components/RecentProducts'));
const InfoBanner = lazy(() => import('../../Components/InfoBanner'));

export default function Home() {
  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Enables smooth scrolling
    });
  }, []);

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
        <meta
          property="og:image"
          content="https://www.frankotrading.com/images/home-og-image.jpg"
        />
        <meta property="og:url" content="https://www.frankotrading.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Franko Trading | Home" />
        <meta
          name="twitter:description"
          content="Discover the best electronics and gadgets at Franko Trading, Ghana's top choice for affordable tech."
        />
        <meta
          name="twitter:image"
          content="https://www.frankotrading.com/images/home-twitter-image.jpg"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <Header />

      <Suspense fallback={<div>Loading...</div>}>
        <ShopByBrandsBanner />
        <ShowRoom />
        <InfoBanner />
        <RecentProducts />
      </Suspense>

      <Footer />
    </div>
  );
}
