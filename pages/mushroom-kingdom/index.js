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

const index = () => {
  const [showMenu, setShowMenu] = useState(false);
  const dataForSEO = {
    title: 'Mushroom Kingdom',
    description: "THE TIME IS NOW; break free from the norm and take control of your future. The world's first-ever referral and recurring income opportunity is launching with the Mushroom Kingdom Nuva NFT collections! Take action today for paydays from the 1st of august; all payments will be in ETH. This is your time, your opportunity to get in on the ground floor and take advantage of the optimum timing. It's simple; you only need to register your wallet on the Nuva NFT site and ensure you have BNB to purchase your own NFTs and enjoy the benefits.  All of this without the need for registration or KYC! Simply connect with like-minded individuals and influencers since this is just the start. The ETH program is merely the beginning, as you will be able to earn with the same network with four different programs! The time is now! Don't wait, don't hesitate, take advantage of this enormous opportunity to change your life. Join the revolution, register today, and get ready to reap the benefits of Referral and Recurring Income with Mushroom Kingdom Nuva NFT collections - And yes, it's a DeFi. It's ONLY on nuvanft.io.",
    hashtag: "#nft #nfts #nftgame #nftart #nftcommunity #nftcollector #nftartist #nftgaming #nftcollection #nftcollectible #referral #4WaystoEarn #DirectReferrals #IndirectReferrals #RoyaltyShare #TransactionFee #Airdrop #ETH #NuvaTokenAirdrop #NuvaToken #SharedPlatformFee #Unilevel #NuvaNFT #MetaNuva #Ecosystem #NuvaGame #NuvaMarket #NuvaWallet #NuvaSwap #NuvaExchange #NuvaPay #NuvaFoundation #NuvaLean #NuvaCompare #NuvaFaucet #Ethereum #Binance #BinanceSmartChain #Polygon #Avalanche #contemporaryart #illustration #cryptocurrency #nftdrop #artwork #eth #nftart #digitalart #nftcollectibles #blockchain #defi #design #nftcollectors #crypto #artoftheday #artist #cryptoart #nftcollector #cryptoartist #nftcommunity #nftartist #btc #ethereum #art #love #drawing #raredigitalart #cryptotrading #nftartwork #music #nftartists #digital #cardano #abstractart #artcollector #digitalartist #modernart #artgallery #cryptonews #nftartgallery #nftcollection #abstract #painting #pixelart #photography #animation #artistsoninstagram #animation #digital #modernart #abstract #render #crypto #blockchain #digitalart #abstractart #artcollector #digitalartist #artoftheday #artwork #contemporaryart #painting #cryptocurrency #artgallery #eth #crypto #cryptonews #cryptotrading #cryptocurrencies #blockchain #render #binance #surreal #digitalartist #ethereum #defi",
    quote : '',
    currentUrl: 'https://nuvanft.io/mushroom-kingdom',
    image: 'https://nuvanft.io/assets/mushroomkingdom.webp',
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
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Henny+Penny&family=Oregano&display=swap" rel="stylesheet"/>
      </Head>
      <main className="rewardingrenditions">
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