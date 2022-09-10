import toast from 'react-hot-toast'
import HeroCarousel from '../components/HeroCarousel'
import HeroSearch from '../components/HeroSearch'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useEffect } from 'react'
import { config } from '../lib/sanityClient'
import HowToInfo from '../components/HowToInfo'
import { useAddress } from '@thirdweb-dev/react'
import ExploreNFTs from '../components/ExploreNFTs'
import TopCollections from '../components/TopCollections'
import { useThemeContext } from '../contexts/ThemeContext'
import BrowseByCategory from '../components/BrowseByCategory'
import SubscribeSection from '../components/SubscribeSection'
import PopularAudioNFTs from '../components/PopularAudioNFTs'
import PopularVideoNFTs from '../components/PopularVideoNFTs'
import axios from 'axios'

const style = {
  wrapper: ``,
  walletConnectWrapper: `flex flex-col justify-center items-center h-screen w-screen bg-[#3b3d42] `,
  button: `border border-[#282b2f] bg-[#2081e2] p-[0.8rem] text-xl font-semibold rounded-lg cursor-pointer text-black`,
  details: `text-lg text-center text=[#282b2f] font-semibold mt-4`,
}

const errorToastStyle = {style: {background: '#ef4444',padding: '16px',color: '#fff',},iconTheme: {primary: '#ffffff',secondary: '#ef4444',},}
const successToastStyle = {style: {background: '#10B981',padding: '16px',color: '#fff',},iconTheme: {primary: '#ffffff',secondary: '#10B981',},}

const Home = ({listedItems}) => {
  // console.log(listedItems)
  const address = useAddress();
  const { dark } = useThemeContext();
  const welcomeUser = (userName, toastHandler = toast) => {
    toastHandler.success(
      `Welcome back ${userName != 'Unnamed' ? `${userName}` : ''} !`, successToastStyle
    )
  }

  useEffect(() => {
    if (!address) return
    ;(async () => {
      const userDoc = {
        _type: 'users',
        _id: address,
        userName: 'Unnamed',
        walletAddress: address,
        profileImage: 'profileImage-'.concat(address),
        bannerImage: 'bannerImage-'.concat(address),
        volumeTraded: 0,
      }

      const result = await config.createIfNotExists(userDoc);
      welcomeUser(result.userName);
    })()
  }, [address]);

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
export async function getStaticProps() {
  // const allListings = await axios.get('http://localhost:8080/api/getAllListings')
  return {
    props: {
      listedItems: 'test'
    },
    revalidate: 300 /*re fetch in every 300 seconds*/

  }
}

export default Home


