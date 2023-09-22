import SEO from '../components/SEO'
import { useRouter } from 'next/router'
import Footer from '../components/Footer'
import Header from '../components/Header'
import HowToInfo from '../components/HowToInfo'
import HeroSearch from '../components/HeroSearch'
import ExploreNFTs from '../components/ExploreNFTs'
import bgimage from '../public/assets/pink.webp'
import HeroCarousel from '../components/HeroCarousel'
import HeroDesigner from '../components/HeroDesigner'
import TopCollections from '../components/TopCollections'
import { useThemeContext } from '../contexts/ThemeContext'
import SubscribeSection from '../components/SubscribeSection'
import BrowseByCategory from '../components/BrowseByCategory'
import RewardingRendition from '../components/RewardingRendition'
import FeaturedCollection from '../components/FeaturedCollection'
import OtherReferralCommissions from '../components/referralCommissions/OtherReferralCommissions';

const HOST = process.env.NODE_ENV == 'production' ? 'https://nuvanft.io:8080' : 'http://localhost:8080' 

const Home = ({ featuredNfts, backendAvailable }) => {
  const { dark } = useThemeContext();
  const router = useRouter();

  return (
    <>
      <SEO />
      <div className={ `${dark ? 'darkBackground text-neutral-200': ''} overflow-x-hidden relative` }>
        <div className="herocarousel bg-top md:bg-center pb-[4rem] relative z-10" style={{ backgroundImage: `url(${bgimage.src})`, backgroundSize: 'cover'}}>
          <Header/>
          <HeroDesigner />
          {/* <OtherReferralCommissions collectionName="rewarding-renditions"/> */}
          {/* {backendAvailable ? (<>
            <HeroCarousel featuredNfts={featuredNfts}/>
            <HeroSearch />
          </>
             ) : ('')} */}
        </div>
        {/* <RewardingRendition /> */}
        <FeaturedCollection/>
        {/* {backendAvailable ? <TopCollections/> : <TopCollections/>} */}
        
          <ExploreNFTs/>
          <HowToInfo/>
          <BrowseByCategory/>
        
        <SubscribeSection />
        <Footer/>
      </div>
    </>
  )
}

export default Home

// export async function getServerSideProps(){
//   try {
//     let featuredNfts = []
//     // const checkserver = await fetch(`${HOST}/api/checkserver`).catch(err => console.log(err));

//     const response = await fetch(`${HOST}/api/getfeaturednfts`).catch(err => console.error(err));
//     if(response){
//       featuredNfts = await response.json();
//     }
    
//       return {
//         props: {
//           featuredNfts: featuredNfts,
//           backendAvailable: true,
//         }
//       }

//   } catch(err){
//     return {
//       props : {
//         featuredNfts : 'Server error',
//         backendAvailable: false,
//       }
//     }
//   }
// }


