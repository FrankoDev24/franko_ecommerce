
import ShowRoom from '../../Components/ShowRoom/ShowRoom'
import ProductCarousel from '../../Components/Carousel/ProductCarousel'
import Footer from '../../Components/Footer/Footer'


export default function Home() {
  return (
    <div>
        <ProductCarousel/>
        <ShowRoom/>
        <div>
        <Footer/>
        </div>
    </div>
  )
}
