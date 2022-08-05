import toast from 'react-hot-toast'
import HeroCarousel from '../components/HeroCarousel'
import HeroSearch from '../components/HeroSearch'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useEffect, useState } from 'react'
import { config } from '../lib/sanityClient'
import HowToInfo from '../components/HowToInfo'
import { useAddress } from '@thirdweb-dev/react'
import { UserProvider } from '../contexts/UserContext'
import ExploreNFTs from '../components/ExploreNFTs'
import TopCollections from '../components/TopCollections'
import BrowseByCategory from '../components/BrowseByCategory'
import { useThemeContext } from '../contexts/ThemeContext'

const style = {
  wrapper: ``,
  walletConnectWrapper: `flex flex-col justify-center items-center h-screen w-screen bg-[#3b3d42] `,
  button: `border border-[#282b2f] bg-[#2081e2] p-[0.8rem] text-xl font-semibold rounded-lg cursor-pointer text-black`,
  details: `text-lg text-center text=[#282b2f] font-semibold mt-4`,
}

const errorToastStyle = {style: {background: '#ef4444',padding: '16px',color: '#fff',},iconTheme: {primary: '#ffffff',secondary: '#ef4444',},}
const successToastStyle = {style: {background: '#10B981',padding: '16px',color: '#fff',},iconTheme: {primary: '#ffffff',secondary: '#10B981',},}

// export const getStaticProps = async (sanityClient = config) => {
//   try{
//     const query = `*[_type == "nftCollection"] {
//       name, contractAddress
//     }`
//     // const res = await fetch('https://jsonplaceholder.typicode.com/users');
//     const res = await sanityClient.fetch(query);
//     const data = await res.json();
  
//     return {
//       props: { collections: data },
//     }
//   }
//   catch(err){
//     return {
//       props : { collections: err.message }
//     }
//   }
// }

const Home = () => {
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
      }

      const result = await config.createIfNotExists(userDoc);
      welcomeUser(result.userName);
    })()
  }, [address]);

  return (
      <div className={ dark ? 'darkBackground text-neutral-200': '' }>
        <Header />
        <HeroCarousel/>
        <HeroSearch />
        <TopCollections/>
        <HowToInfo/>
        <ExploreNFTs/>
        <BrowseByCategory/>
        <Footer/>
      </div>
  )
}

export default Home


