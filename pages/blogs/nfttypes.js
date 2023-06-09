import React from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Panda from '../../public/assets/adorable_panda.jpg'
import Tiger from '../../public/assets/adorable_tiger.jpg'
import Flower from '../../public/assets/flowers.jpg'
import SEO from '../../components/SEO';


const nfttypes = () => {
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
      <SEO title="NFT Types"/>
      <Header />
      <div
        className={
          dark
            ? style.pageBanner + ' bg-slate-800'
            : style.pageBanner + ' bg-sky-100'
        }
      >
        <h2 className={style.pageTitle}>Types of NFTs</h2>
      </div>
      <div className={style.wrapper}>
        <div className="w-full flex flex-wrap gap-5">
            <img src={Panda.src} className="max-w-xs object-cover rounded-xl outline-4 outline outline-neutral-200 shadow-md" />
            <img src={Flower.src} className="hidden lg:block max-w-xs object-cover rounded-xl outline-4 outline outline-neutral-200 shadow-md" />
            <img src={Tiger.src} className="hidden lg:block max-w-xs object-cover rounded-xl outline-4 outline outline-neutral-200 shadow-md" />
            <div className="mx-auto w-full rounded-2xl space-y-[2rem]">
              <p>Decide what kind of NFT you want to create.</p>
              <div><p className="text-4xl mb-2">Art</p>Do you have an original concept but struggle with actually creating the art? When it comes to creating NFT artwork, one of the options that artists and collectors have is to commission other artists to create the artwork for them.  Some websites specialise in connecting artists with clients looking for customised pieces.  By browsing these websites, collectors can scroll through various artists' portfolios and choose the one that best matches their vision.  Typically, collectors can communicate with the artist throughout the creative process to ensure that the final product meets their specifications.  These websites allow artists and collectors to collaborate and create unique and original works of art that can be turned into NFTs.  However, it is important to keep in mind that the success of the NFT will depend on the quality and popularity of the artwork, so it is worth investing time and effort in finding the right artist for the job (if you are not creating the NFT yourself).  An example of a website that offers NFT artwork creation is Fiverr - Freelance Services Marketplace – although there are others, so please have a look around and find the right provider for you.</div>
              <div>However, one of the great things about NFTs is that you don’t need to be a famous artist or a master of your craft to create your own unique NFT.  In fact, many NFTs have been created by artists with little to no experience, and children have even created some.  The true value of an NFT lies not in the skill or reputation of the creator but in the originality of the concept and the personal meaning it holds.   NFTs provide a new way for anyone to express their creativity and connect with an audience without the need for traditional gatekeepers such as galleries or publishers.  Instead, NFTs allow you to showcase your work directly to potential buyers, regardless of your background or level of expertise.  While it can be tempting to focus on the quality of the art itself, what truly sets NFTs apart is the unique ownership they provide.  Each NFT is like a digital certificate of authenticity that verifies its unique origin and confirms the collector’s ownership of the work.  In this sense, the value of an NFT is not tied to the traditional metrics of art appreciation, such as technical skill or beauty.  Instead, it is all about a piece’s concept and story.  With NFTs, anyone can create value through their ideas and personal experiences, making this new technology so exciting. </div>
              <div>One of the unique aspects of NFTs is that they allow for a virtually endless array of concepts to be transformed into digital art.  Some of the most popular concepts that have been transformed into NFTs include Memes: Memes often go viral on social media platforms. NFTs provide a new way for these internet phenomena to gain value and recognition as unique art pieces.  For example, the famous “Nyan Cat” meme was recently sold for $590,000 as an NFT.  Virtual Real Estate: with the rise of virtual worlds and games, virtual real estate has become a popular commodity.  NFTs allow for virtual real estate to be authenticated and traded as unique digital assets, with some plots of land in virtual environments selling for millions of dollars. Gaming items and collectables: NFTs allow for in-game items, skins and other collectables to be authenticated and traded for real value.  This has created a new esports economy, with some virtual items selling for hundreds of thousands of dollars.  Virtual fashion:  As virtual fashion worlds become more immersive, virtual fashion has emerged as a new kind of digital art.  With NFTs, virtual clothing and accessories can be bought and sold as unique, one-of-a-kind assets.  Music NFTs can be used to represent the ownership of digital music tracks or exclusive rights to an album (more on the music below).  Overall, the range of concepts that have been transformed into NFTs is vast, diverse, and ever-expanding.  This opens up a new world of possibilities for artists, creators, collectors, and those interested in exploring cutting-edge of digital art and innovation.</div>
              <div><p className="text-4xl mb-2">Music</p>Perhaps music is your passion? A wide range of music NFTs can also be created, including but not limited to full albums or individual tracks. Musicians can create exclusive remixes of their existing songs to be sold as NFTs, and live performances, such as concerts or VIP sessions, can be recorded and turned into NFTs.  NFTs can be created for the ownership or share in the royalties of a song or album, and astute musicians create branded merchandise, such as t-shirts, stickers or posters, which can be sold as NFTs.  Music NFTs can also collaborate with other artists or visual designers, creating unique pieces combining music and other art forms.  Overall the possibilities for music NFTs are almost limitless, providing musicians with a new way to monetise their art and engage with their fans in a unique way.</div>
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

export default nfttypes