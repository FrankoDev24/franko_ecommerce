import { lazy, Suspense, useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../Components/Navbar/Header';
import Footer from '../../Components/Footer/Footer';

// Lazy loading components
const ShowRoom = lazy(() => import('../../Components/ShowRoom/ShowRoom'));
const ShopByBrandsBanner = lazy(() => import('../../Components/BrandsBanner'));
const RecentProducts = lazy(() => import('../../Components/RecentProducts'));
const InfoBanner = lazy(() => import('../../Components/InfoBanner'));

// Loader Component
const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-12 h-12 border-4 border-red-500 border-dashed rounded-full animate-spin"></div>
  </div>
);

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
          content="Discover unbeatable deals on mobile phones, laptops, and accessories at Franko Trading, Ghana's trusted name for electronics. Enjoy quality products, fast delivery, and outstanding customer service."
        />
        <meta
          name="keywords"
          content="Franko Trading, electronics in Ghana, mobile phones Ghana, laptops Ghana, affordable gadgets, quality electronics, Franko gadgets, Ghana tech deals"
        />
        <meta name="author" content="Franko Trading Enterprise" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Franko Trading | Home" />
        <meta
          property="og:description"
          content="Shop Franko Trading for premium gadgets, mobile phones, and laptops in Ghana. Affordable prices, reliable service."
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
          content="Explore Franko Trading for Ghana's best tech deals. Quality products, great prices, and trusted service."
        />
        <meta
          name="twitter:image"
          content="https://www.frankotrading.com/images/home-twitter-image.jpg"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <Header />

      <Suspense fallback={<Loader />}>
        <ShopByBrandsBanner />
        <ShowRoom />
        <InfoBanner />
        <RecentProducts />
      </Suspense>

      <Footer />
    </div>
  );
}
