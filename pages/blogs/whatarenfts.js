import React from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Panda from '../../public/assets/adorable_panda.jpg'
import Tiger from '../../public/assets/adorable_tiger.jpg'
import Flower from '../../public/assets/flowers.jpg'


const whatarenfts = () => {
  const { dark } = useThemeContext();
  const style = {
      wrapper: 'container mx-auto lg:p-[8rem] p-[2rem] lg:pt-4 lg:pb-0 max-w-7xl',
      pageBanner: 'pb-[4rem] pt-[10rem] gradSky mb-[2rem]',
      pageTitle: 'text-4xl font-bold text-center text-white',
      section: 'p-2 lg:p-8 mb-8 rounded-xl border-sky-700/30 border transition',
      header: 'font-bold text-lg lg:text-xl mb-2',
      table: `rounded-3xl border ${dark ? 'border-slate-700' : 'border-neutral-100'} w-[56] p-4 mt-4`,
      tableRow: `flex gap-4 flex-col md:flex-row items-center border-b ${dark ? 'border-slate-700' : 'border-neutral-100'} p-8`,
      tableColFirst: 'w-full md:w-[100px] md:min-w-[100px] text-center font-bold',
      anothertableColFirst: 'w-full md:w-[250px] md:min-w-[250px] text-center font-bold',
      tableColSecond: 'grow',
      button: 'text-white rounded-md border border-sky-700/40 p-1 px-2 text-sm bg-sky-900/60 whitespace-nowrap',
    }
    
  return (
    <div className={`overflow-hidden ${dark && 'darkBackground'}`}>
    <Header />
    <div
      className={
        dark
          ? style.pageBanner + ' bg-slate-800'
          : style.pageBanner + ' bg-sky-100'
      }
    >
      <h2 className={style.pageTitle}>What are NFTs?</h2>
    </div>
    <div className={style.wrapper}>
      <div className="w-full flex flex-wrap gap-5">
          <img src={Panda.src} className="max-w-xs object-cover rounded-xl outline-4 outline outline-neutral-200 shadow-md" />
          <img src={Flower.src} className="hidden lg:block max-w-xs object-cover rounded-xl outline-4 outline outline-neutral-200 shadow-md" />
          <img src={Tiger.src} className="hidden lg:block max-w-xs object-cover rounded-xl outline-4 outline outline-neutral-200 shadow-md" />
          <div className="mx-auto w-full rounded-2xl space-y-[2rem]">
            <p>To truly appreciate what Nuva NFT offers and maximise your benefits, it is important to understand what NFTs are. </p>
            <p>NFTs or non-fungible tokens are digital assets that represent ownership of unique and indivisible items such as artwork, music, videos, and even tweets.  They are created on a blockchain, which is a digital ledger that records every transaction and ensures the authenticity and permanence of the asset.  The token is proof of ownership and contains a smart contract outlining the ownership terms and any associated royalties or resale rights.  NFTs have gained popularity in the art world and are seen as a way to give artists more control over their work and create new revenue streams.  It is an excellent time for you to seize the opportunity and take advantage of the rise in the popularity of NFTs.  NFTs can be truly life-changing for their creators, and the great thing is that you don’t need to be a Picasso! (More on that later).</p>
            <p>But first, let’s look at why NFTs are the future.  They offer a new way for artists and creators to monetize their work and earn a fair price for their creations.  In the past, artists or creators have found it challenging to get paid for their work/creations online, as digital content can be easily copied or pirated.  NFTs provide a unique solution to this problem by offering a secure and transparent way to sell digital art and earn a commission on future sales.  NFTs can also be used to tokenise real-world assets such as real estate, cars or other physical assets.  This means that ownership of these assets can be tracked and verified on a secure digital ledger, which could potentially disrupt the traditional industries that manage these assets.  NFTs are innovative and exciting and have captured the imagination of investors and collectors alike. As more and more people become interested in NFTs, their value is likely to increase, creating new investment opportunities and driving growth in the overall market.  You can get ahead of the curve by using the Nuva NFT platform immediately; if you have ever wished you were “in first” and ahead of the game, then this is your time to reap the benefits of NFTs with the Nuva NFT platform.</p>
            <p>Fundamentally, NFTs offer a new way to own and trade unique digital assets, and they are likely to play an increasingly important role in the future of the art and tech industries.  The value of an NFT is determined by its uniqueness and demand, similar to traditional art or collectables.  Some NFTs have sold for millions of dollars, such as Beeple’s “Everydays: The First 5000 Days”, which sold for $69 million at auction and Pak’s The Merge was sold to a group of collectors for $91.8 m! The value of an NFT is also influenced by the underlying asset they represent, such as digital art, music, or even virtual real estate.  As the popularity of NFTs continues to grow, their value is likely to increase as well.  The important point to take note of from this is that the concept behind the NFT drives the value – have you considered what your concept will be?</p>
            <p>Now is the perfect time to get involved with NFTs due to their increasing popularity and mainstream adoption.  NFTs provide a unique opportunity for creators to monetize their digital content and for collectors to own one-of-a-kind assets.  The market for NFTs is rapidly expanding, with high-profile sales and collaborations with major brands and celebrities.  Additionally, the technology behind NFTs is constantly evolving, making them more accessible and secure.  Don’t miss out on this exciting new frontier in the digital world.</p>
          </div>
      </div>
      <div className="flex justify-center mt-[3rem]">
        <a className="rounded-xl gradBlue text-white p-3 px-4" href="/contracts">Start Creating NFTs</a>
      </div>
    </div>
    <Footer/>
  </div>
  )
}

export default whatarenfts