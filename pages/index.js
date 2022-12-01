import HeroCarousel from '../components/HeroCarousel'
import HeroSearch from '../components/HeroSearch'
import Footer from '../components/Footer'
import Header from '../components/Header'
import HowToInfo from '../components/HowToInfo'
import ExploreNFTs from '../components/ExploreNFTs'
import TopCollections from '../components/TopCollections'
import { useThemeContext } from '../contexts/ThemeContext'
import BrowseByCategory from '../components/BrowseByCategory'
import SubscribeSection from '../components/SubscribeSection'
import PopularAudioNFTs from '../components/PopularAudioNFTs'
import PopularVideoNFTs from '../components/PopularVideoNFTs'

const Home = () => {
  const { dark } = useThemeContext();

  return (
      <div className={ dark ? 'darkBackground text-neutral-200': '' }>
        <Header/>
        <HeroCarousel/>
        <HeroSearch />
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


