
import ShowRoom from '../../Components/ShowRoom/ShowRoom'
import ProductCarousel from '../../Components/Carousel/ProductCarousel'
import Footer from '../../Components/Footer/Footer'
import ShopByBrandsBanner from '../../Components/BrandsBanner'


export default function Home() {
  return (
    <div>
        <ProductCarousel/>
        <ShowRoom/>
        <ShopByBrandsBanner/>
        <div>

        <Footer/>
        </div>
    </div>
  )
}
