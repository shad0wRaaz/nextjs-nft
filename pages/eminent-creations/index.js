import Head from 'next/head'
import Faq from './components/Faq'
import Buy from './components/Buy'
import Hero from './components/Hero'
import SEO from '../../components/SEO'
import React, { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Videos from './components/Videos'
import Gallery from './components/Gallery'
import Roadmap from './components/Roadmap'
import Community from './components/Community'
import bannerbg from './assets/images/banner-bg-ec.webp'
import HelmetMetaData from '../../components/HelmetMetaData'
import socialcoverimage from './assets/images/socialcoverimage.webp'

const index = () => {
  const [showMenu, setShowMenu] = useState(false);
  const dataForSEO = {
    title: 'Eminent Creations',
    description: "THE TIME IS NOW; break free from the norm and take control of your future. On June 30th 2023, the world's first-ever referral and recurring income opportunity is launching with the Rewarding Renditions Nuva NFT collections! Take action today for paydays from the 30th of June; all payments will be in MATIC. This is your time, your opportunity to get in on the ground floor and take advantage of the optimum timing. It's simple; you only need to register your wallet on the Nuva NFT site and ensure you have MATIC to purchase your own NFTs and enjoy the benefits.  All of this without the need for registration or KYC! Simply connect with like-minded individuals and influencers since this is just the start. The MATIC program is merely the beginning, as you will be able to earn with the same network with four different programs! The time is now! Don't wait, don't hesitate, take advantage of this enormous opportunity to change your life. Join the revolution, register today, and get ready to reap the benefits of Referral and Recurring Income with Rewarding Renditions Nuva NFT collections –And yes, it's a DeFi. And yes, it's ONLY on nuvanft.io.  Launching on 30th June...This is YOUR time. Are you ready?",
    hashtag: "#nft #nfts #nftgame #nftart #nftcommunity #nftcollector #nftartist #nftgaming #nftcollection #nftcollectible #referral #4WaystoEarn #DirectReferrals #IndirectReferrals #RoyaltyShare #TransactionFee #Airdrop #ETH #NuvaTokenAirdrop #NuvaToken #SharedPlatformFee #Unilevel #NuvaNFT #MetaNuva #Ecosystem #NuvaGame #NuvaMarket #NuvaWallet #NuvaSwap #NuvaExchange #NuvaPay #NuvaFoundation #NuvaLean #NuvaCompare #NuvaFaucet #Ethereum #Binance #BinanceSmartChain #Polygon #Avalanche #contemporaryart #illustration #cryptocurrency #nftdrop #artwork #eth #nftart #digitalart #nftcollectibles #blockchain #defi #design #nftcollectors #crypto #artoftheday #artist #cryptoart #nftcollector #cryptoartist #nftcommunity #nftartist #btc #ethereum #art #love #drawing #raredigitalart #cryptotrading #nftartwork #music #nftartists #digital #cardano #abstractart #artcollector #digitalartist #modernart #artgallery #cryptonews #nftartgallery #nftcollection #abstract #painting #pixelart #photography #animation #artistsoninstagram #animation #digital #modernart #abstract #render #crypto #blockchain #digitalart #abstractart #artcollector #digitalartist #artoftheday #artwork #contemporaryart #painting #cryptocurrency #artgallery #eth #crypto #cryptonews #cryptotrading #cryptocurrencies #blockchain #render #binance #surreal #digitalartist #ethereum #defi",
    quote : '',
    currentUrl: 'https://nuvanft.io/eminent-creations',
    image: 'https://nuvanft.io/assets/socialcoverimage.webp',
  }
  return (
    <>
      <SEO
        title={dataForSEO.title}
        description={dataForSEO.description}
        hashtag={dataForSEO.hashtag}
        image={dataForSEO.image}
        currentUrl={dataForSEO.currentUrl}
      />
      <main className="eminentcreations" style={{ backgroundImage: `url('${bannerbg.src}')`, backgroundAttachment: 'fixed', backgroundSize: 'cover'}}>
          <Header showMenu={showMenu} setShowMenu={setShowMenu} />
          <Hero setShowMenu={setShowMenu}/>
          <Gallery setShowMenu={setShowMenu}/>
          <Buy setShowMenu={setShowMenu}/>
          <Roadmap setShowMenu={setShowMenu}/>
          <Community setShowMenu={setShowMenu}/>
          <Faq setShowMenu={setShowMenu}/>
          <Videos setShowMenu={setShowMenu}/>
          <Footer setShowMenu={setShowMenu}/>
      </main>
    </>
  )
}

export default index