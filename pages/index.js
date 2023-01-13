import Footer from '../components/Footer'
import Header from '../components/Header'
import HowToInfo from '../components/HowToInfo'
import HeroSearch from '../components/HeroSearch'
import ExploreNFTs from '../components/ExploreNFTs'
import HeroCarousel from '../components/HeroCarousel'
import TopCollections from '../components/TopCollections'
import HelmetMetaData from '../components/HelmetMetaData'
import { useThemeContext } from '../contexts/ThemeContext'
import herobackground from '../assets/herobackground.jpeg'
import SubscribeSection from '../components/SubscribeSection'
import BrowseByCategory from '../components/BrowseByCategory'
import PopularAudioNFTs from '../components/PopularAudioNFTs'
import PopularVideoNFTs from '../components/PopularVideoNFTs'

const HOST = process.env.NODE_ENV == 'production' ? 'https://nuvanft.io:8080' : 'http://localhost:8080' 

const Home = (props) => {
  if(props.featuredNfts == 'Server error') {
    return (
      <div class="container bg-red-500 rounded-xl p-3 text-white text-center m-4 mx-auto">
        Feeding server Error. Please contact administrator.
      </div>
      )
  }
  const { dark } = useThemeContext();

  return (
      <div className={ `${dark ? 'darkBackground text-neutral-200': ''} overflow-x-hidden` }>
        <HelmetMetaData
          title="Nuva NFT"
          description="A Multichain NFT Marketplace"
          tokenId={"v1.0"}
          contractAddress={"NUVA"}>  
        </HelmetMetaData>
        <div className="herocarousel bg-top md:bg-center md:pb-[8rem] relative z-10" style={{ backgroundImage: `url(${herobackground.src})`}}>
          <Header/>
          <HeroCarousel featuredNfts={props.featuredNfts}/>
          <HeroSearch />
        </div>
        <TopCollections/>
        <HowToInfo/>
        <ExploreNFTs/>
        <BrowseByCategory/>
        <PopularVideoNFTs />
        <PopularAudioNFTs />
        <SubscribeSection />
        <Footer/>
      </div>
  )
}

export default Home

export async function getServerSideProps(){
  try {
    const response = await fetch(`${HOST}/api/getfeaturednfts`);
    const featuredNfts = await response.json();
    
      return {
        props: {
          featuredNfts: featuredNfts
        }
      }

  }catch(err){
    return {
      props : {
        featuredNfts : 'Server error'
      }
    }
  }
}


