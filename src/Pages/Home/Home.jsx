
import ShowRoom from '../../Components/ShowRoom/ShowRoom'

import Footer from '../../Components/Footer/Footer'
import ShopByBrandsBanner from '../../Components/BrandsBanner'
import RecentProducts from '../../Components/RecentProducts'
import Header from '../../Components/Navbar/Header'
import InfoBanner from '../../Components/InfoBanner';  // Correct for default export




export default function Home() {
  return (
    <div>
      <div>
<Header/>
</div>
<ShopByBrandsBanner/>
        <ShowRoom />
   
         <InfoBanner/>
     
     
     <RecentProducts/>

        <div>
          

        <Footer/>
        </div>
    </div>
  )
}
