import Footer from '../components/Footer'
import Header from '../components/Header'
import { useEffect, useState } from 'react'
import HowToInfo from '../components/HowToInfo'
import HeroSearch from '../components/HeroSearch'
import ExploreNFTs from '../components/ExploreNFTs'
import HeroCarousel from '../components/HeroCarousel'
import TopCollections from '../components/TopCollections'
import { useThemeContext } from '../contexts/ThemeContext'
import herobackground from '../assets/herobackground.jpeg'
import SubscribeSection from '../components/SubscribeSection'
import BrowseByCategory from '../components/BrowseByCategory'
import PopularAudioNFTs from '../components/PopularAudioNFTs'
import PopularVideoNFTs from '../components/PopularVideoNFTs'
import { useRouter } from 'next/router'

const HOST = process.env.NODE_ENV == 'production' ? 'https://nuvanft.io:8080' : 'http://localhost:8080' 

const Home = ({ featuredNfts, backendAvailable }) => {
  const { dark } = useThemeContext();
  const router = useRouter();

  return (
      <div className={ `${dark ? 'darkBackground text-neutral-200': ''} overflow-x-hidden relative` }>
        <div className="herocarousel bg-top md:bg-center md:pb-[8rem] relative z-10" style={{ backgroundImage: `url(${herobackground.src})`}}>
          <Header/>
          {backendAvailable ? (<>
            <HeroCarousel featuredNfts={featuredNfts}/>
            {/* <HeroSearch /> */}
          </>
             ) : ('')}
        </div>
        {backendAvailable ? <TopCollections/> : ''}
        <HowToInfo/>
        {backendAvailable ? 
        <>
          <ExploreNFTs/>
          <BrowseByCategory/>
          {/* <PopularVideoNFTs /> */}
          {/* <PopularAudioNFTs /> */}
        </>
        : ''}
        <SubscribeSection />
        <Footer/>
      </div>
  )
}

export default Home

export async function getServerSideProps(){
  try {
    let featuredNfts = []
    const checkserver = await fetch(`${HOST}/api/checkserver`).catch(err => console.log(err));

    const response = await fetch(`${HOST}/api/getfeaturednfts`).catch(err => console.error(err));
    if(response){
      featuredNfts = await response.json();
    }
    
      return {
        props: {
          featuredNfts: featuredNfts,
          backendAvailable: true,
        }
      }

  } catch(err){
    return {
      props : {
        featuredNfts : 'Server error',
        backendAvailable: false,
      }
    }
  }
}


