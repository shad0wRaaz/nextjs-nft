import Head from 'next/head'
import Faq from './components/Faq'
import Buy from './components/Buy'
import Hero from './components/Hero'
import React, { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Videos from './components/Videos'
import Gallery from './components/Gallery'
import Roadmap from './components/Roadmap'
import Community from './components/Community'
import socialcoverimage from './assets/images/socialcoverimage.webp'
import HelmetMetaData from '../../components/HelmetMetaData'
import SEO from '../../components/SEO'

const index = () => {
  const [showMenu, setShowMenu] = useState(false);
  const dataForSEO = {
    title: 'Rewarding Renditions',
    description: "THE TIME IS NOW; break free from the norm and take control of your future. On June 30th 2023, the world's first-ever referral and recurring income opportunity is launching with the Rewarding Renditions Nuva NFT collections! Take action today for paydays from the 30th of June; all payments will be in BNB. This is your time, your opportunity to get in on the ground floor and take advantage of the optimum timing. It's simple; you only need to register your wallet on the Nuva NFT site and ensure you have BNB to purchase your own NFTs and enjoy the benefits.  All of this without the need for registration or KYC! Simply connect with like-minded individuals and influencers since this is just the start. The BNB program is merely the beginning, as you will be able to earn with the same network with four different programs! The time is now! Don't wait, don't hesitate, take advantage of this enormous opportunity to change your life. Join the revolution, register today, and get ready to reap the benefits of Referral and Recurring Income with Rewarding Renditions Nuva NFT collections –And yes, it's a DeFi. And yes, it's ONLY on nuvanft.io.  Launching on 30th June...This is YOUR time. Are you ready?",
    hashtag: "#nft #nfts #nftgame #nftart #nftcommunity #nftcollector #nftartist #nftgaming #nftcollection #nftcollectible #referral #4WaystoEarn #DirectReferrals #IndirectReferrals #RoyaltyShare #TransactionFee #Airdrop #BNB #NuvaTokenAirdrop #NuvaToken #SharedPlatformFee #Unilevel #NuvaNFT.io #NuvaNFT #MetaNuva #Ecosystem #NuvaGame #NuvaMarket #NuvaWallet #NuvaSwap #NuvaExchange #NuvaPay #NuvaFoundation #NuvaLean #NuvaCompare #NuvaFaucet #Bitcoin #Ethereum #BNB #Binance #BinanceSmartChain #Polygon #Avalanche #BoredApe #Azuki #zukunft #fünftejahreszeit #vnft #nft #canonftb #zukunftgestalten #olympuspenft #senftenberg #zurückindiezukunft #hisingenftw #penft #unterkunft #canonftql #downtownftl #canonftbql #iamvnft #canonft #veganftw #nfts #vernunft #zukunftspläne #downtownftlauderdale #sanft #ankunft #nftg #deutschrapszukunft #fashionftheday #deinezukunft #zünftig #senftenbergersee #unserezukunft #narrenzunft #meinezukunft #donfteinvita #zunft #indianftr1200 #baldzufünft #tiniviolettaszukunft #herkunft #nftherapysession #opensea #contemporaryart #illustration #cryptocurrency #nftdrop #artwork #eth #nftart #digitalart #nftcollectibles #blockchain #defi #design #nftcollectors #crypto #bitcoin #nfts #artoftheday #artist #d #nft #openseanft #cryptoart #nftcollector #cryptoartist #nftcommunity #nftartist #btc #ethereum #art #rarible #artistsoninstagram #metaverse #dogecoin #love #drawing #raredigitalart #cryptotrading #nftartwork #music #dart #blender #nftartists #digital #cardano #abstractart #artcollector #digitalartist #modernart #artgallery #cryptonews #c #nftartgallery #nftcollection #abstract #painting #pixelart #photography #animation #artistsoninstagram #animation #digital #modernart #btc #abstract #render #crypto #blockchain #digitalart #abstractart #artcollector #digitalartist #bitcoin #artoftheday #artwork #contemporaryart #painting #cryptocurrency #artgallery #eth #crypto #blender #cryptonews #cryptotrading #btc #elonmusk #cryptocurrencies #blockchain #render #binance #surreal #digitalartist #ethereum #raredigitalart #nft #cardano #nfte #nftime #nfts #defi #nftry #nft #nftan #nftu #opensea #nftypebeat #nftsystem #nfthesearch #nftherapysession #nftour #cryptoart #dogecoin #superrare #dart #nfthidroponik #nfte #nftan #youtube #youtuber #instagram #music #love #spotify #tiktok #follow #like #explorepage #youtubers #youtubechannel #gaming #twitch #video #instagood #hiphop #memes #viral #subscribe #gamer #rap #facebook #explore #ps #art #soundcloud #k #artist #trending #newmusic #bhfyp #likeforlikes #followforfollowback #photography #fortnite #funny #meme #m #applemusic #s #rapper #fashion #podcast #producer #game #a #twitter #xbox #playstation #itunes #likes #vlog #sub #trap #streamer #live #o #games #meme #gifnft #motionnft #videonft #contentcreator #musicalnft #viral #facebook #instagram #youtube #twitter #tiktok #love #instagood #follow #like #socialmedia #whatsapp #music #google #photography #marketing #india #memes #followforfollowback #likeforlikes #insta #a #trending #fashion #digitalmarketing #viral #k #m #socialmediamarketing #linkedin #covid #instadaily #business #snapchat #motivation #photooftheday #likes #video #f #live #followers #n #s #model #spotify #news #marketingdigital #followme #smile #meme #lifestyle #followback #travel #beauty #l #life #share #facebooklive #fun #workfromhome #passiveincome #passiveincome #financialfreedom #entrepreneur #investing #money #business #success #entrepreneurship #wealth #investment #motivation #bitcoin #forex #makemoneyonline #stocks #realestate #finance #stockmarket #investor #makemoney #invest #trading #affiliatemarketing #onlinebusiness #crypto #cryptocurrency #cashflow #millionaire #income #workfromhome #dirumahaja #wfh #covid #entrepreneur #stayathome #business",
    quote : '',
    image: 'https://nuvanft.io/assets/socialcoverimage.webp',
  }
  return (
    <>
      <SEO
        title={dataForSEO.title}
        description={dataForSEO.description}
        hashtag={dataForSEO.hashtag}
        image={dataForSEO.image}
      />
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