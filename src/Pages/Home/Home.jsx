
import ShowRoom from '../../Components/ShowRoom/ShowRoom'

import Footer from '../../Components/Footer/Footer'
import ShopByBrandsBanner from '../../Components/BrandsBanner'
import RecentProducts from '../../Components/RecentProducts'
import Header from '../../Components/Navbar/Header'


export default function Home() {
  return (
    <div>
      <div>
<Header/>
</div>
        <ShowRoom />
        <ShopByBrandsBanner/>
     <RecentProducts/>
        <div>
          

        <Footer/>
        </div>
    </div>
  )
}
