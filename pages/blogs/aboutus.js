import React from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Panda from '../../public/assets/adorable_panda.jpg'
import Tiger from '../../public/assets/adorable_tiger.jpg'
import Flower from '../../public/assets/flowers.jpg'
import SEO from '../../components/SEO';


const aboutus = () => {
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
      <SEO title="About Us"/>
      <Header />
      <div
        className={
          dark
            ? style.pageBanner + ' bg-slate-800'
            : style.pageBanner + ' bg-sky-100'
        }
      >
        <h2 className={style.pageTitle}>About Us</h2>
      </div>
      <div className={style.wrapper}>
        <div className="w-full flex flex-wrap gap-5">
            <img src={Panda.src} className="max-w-xs object-cover rounded-xl outline-4 outline outline-neutral-200 shadow-md" />
            <img src={Flower.src} className="hidden lg:block max-w-xs object-cover rounded-xl outline-4 outline outline-neutral-200 shadow-md" />
            <img src={Tiger.src} className="hidden lg:block max-w-xs object-cover rounded-xl outline-4 outline outline-neutral-200 shadow-md" />
            <div className="mx-auto w-full rounded-2xl space-y-[2rem]">
              <p>Nuva NFT is a platform that was designed to benefit you as a creator and provide you with a fair and transparent platform to sell your NFTs. As the creator, you receive 100% of the value of the NFT  when it is sold, ensuring that you receive the full value for your work.  This contrasts with other marketplaces that may take payment from you as a commission.  By not taking a commission, Nuva NFT encourages more creators to use their platform and creates a more equitable marketplace for artists of all levels.  Additionally, the 2.5% fee the purchaser pays helps fund the platform’s operations. It ensures that the platform can continue to provide support and resources to creators over the long term.  Overall, Nuva NFT’s unique business model benefits creators and purchasers, providing a fair and transparent platform that rewards you as an artist for your work and enables collectors to discover and own amazing creations.</p>
              <p>As a creator of an NFT, you can earn a 10% (generally set by the creator) royalty each time your NFT is resold, giving you a unique opportunity to receive ongoing compensation for your art.  This is made possible thanks to blockchain technology that underlies NFTs.  Using smart contracts, the blockchain ensures that a portion of the sale price is automatically paid to the NFT creator each time it is sold.  This incentivises creators to continue producing original and high-quality art and helps foster a more sustainable and equitable art market.  By earning a royalty each time your NFT is sold, you can receive a steady stream of income that can be invested into new projects, used to support artistic endeavours, or provide you with the financial stability to pursue your passions.  This also benefits collectors, as they can be confident that the art they buy is unique and supports the artist who created it.  Overall, the royalty system built into NFTs represents a revolutionary change in the art world, providing a more transparent and fair way for you to benefit from your work.</p>
              <p>Nuva NFT platform is one of the leading platforms in the world of NFTs and offers a range of revolutionary features that set it apart from other platforms.  One of the most notable features of Nuva NFT is that it allows users to sell their NFT on four different blockchain networks: Ethereum, Binance Smartchain, Polygon and Avalanche.  This is an unprecedented feature that offers users unparalleled flexibility and convenience.  Unlike other NFT platforms, which are typically limited to a single blockchain or, in some instances, two blockchains, Nuva NFT platform’s ability to sell NFTs on four different chains provides you with a wide range of options.  This allows users to choose the blockchain network that best suits their needs, whether they are looking for further security, lower fees, or faster transaction times.  Additionally, by allowing NFTs to be sold on multiple chains, the Nuva NFT platform mitigates the risk of any one blockchain network becoming overloaded or congested.  This ensures that NFT transactions can be completed smoothly and efficiently without the risk of delays or downtime.  The ability to sell NFTs on four different blockchain networks makes the Nuva NFT platform revolutionary. It highlights the platform’s commitment to providing users with the best possible experience while pushing the boundaries of what is possible with NFTs. </p>
              <p>One of the unique features of Nuva NFT is that it allows users to list “test NFTs” for free. By listing a test NFT, you can experiment with different pricing strategies, explore the platform’s interface, and get a sense of how the platform operates in a risk-free environment.  This allows you to familiarise yourself with the platform and gain confidence before listing your NFT for sale.  Importantly, test NFTs are also useful for testing the platform’s interoperability across all supported networks.  Since Nuva NFT platform allows NFTs to be solely on the Ethereum, Binance Smart Chain, Polygon and Avalanche, testing NFTs can help ensure transactions and interactions with the platform are seamless and fast across all supported networks.  The ability to list test NFTs is another example of how the Nuva NFT platform focuses on user experience and community building, providing you with the tools you need to succeed in the world of NFTs.</p>
              <p>If you have never considered creating or purchasing an NFT before, we strongly urge you to do so now and take advantage of our Nuva NFT platform – it is just one way you could change your life.  If you are an experienced NFT creator or collector, you will appreciate the potential of Nuva NFT.</p>
              <p>Meta Nuva and Nuva NFT are incredibly proud to offer ongoing training sessions and videos for you to optimize your user experience.  These training sessions cover a wide range of topics, including creating and selling NFTs, using the platform’s various features and tools, and navigating the ever-evolving world of NFTs.  These videos and training sessions are designed to be informative and engaging, providing users with valuable insights and practical guidance to help them succeed in the world of NFTs.  For creators, these training sessions can help you to understand the market better and help you create NFTs that will resonate with buyers.  They can also help creators navigate technical challenges and understand best practices for marketing and selling their NFTs.  For collectors, these training sessions can help you further understand how to navigate the platform, including browsing and searching for NFTs, making informed purchase decisions, and managing your NFT collections.  The ongoing training sessions and videos (in addition to this guide) offered by Nuva NFT demonstrate our commitment to providing our users and Community Members with the tools and resources you need to succeed in the world of NFTs and emphasise the importance of community building and education in this rapidly evolving industry.  Whilst we are committed to supporting you in the best ways possible, the onus is on you to access the help and education that is available to you to enable you to maximise the potential of Nuva NFT.</p>
            </div>
        </div>
        <div className="flex justify-center mt-[3rem] gap-3 flex-wrap">
          <a className="rounded-xl gradBlue text-white p-3 px-4" href="/tutorials/getstarted">Learn to get started</a>
          <a className="rounded-xl gradBlue text-white p-3 px-4" href="/contracts">Start Creating NFTs</a>
        </div>
      </div>
      <Footer/>
  </div>
  )
}

export default aboutus