import React from 'react'
import { useThemeContext } from '../../contexts/ThemeContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Panda from '../../public/assets/adorable_panda.jpg'
import Tiger from '../../public/assets/adorable_tiger.jpg'
import Flower from '../../public/assets/flowers.jpg'


const nftterms = () => {
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
      <h2 className={style.pageTitle}>NFT Terms</h2>
    </div>
    <div className={style.wrapper}>
      <div className="w-full flex flex-wrap gap-5">
          <img src={Panda.src} className="max-w-xs object-cover rounded-xl outline-4 outline outline-neutral-200 shadow-md" />
          <img src={Flower.src} className="hidden lg:block max-w-xs object-cover rounded-xl outline-4 outline outline-neutral-200 shadow-md" />
          <img src={Tiger.src} className="hidden lg:block max-w-xs object-cover rounded-xl outline-4 outline outline-neutral-200 shadow-md" />
          <div className="mx-auto w-full rounded-2xl space-y-[2rem]">
            <div><p className="text-4xl mb-2">Attributes/Properties</p>Attributes/Properties are essential to NFTs and can significantly contribute to their overall value. Attributes refer to unique qualities that distinguish one NFT from another, such as specific traits or characteristics that are rare or highly sought after.  These attributes can be inherent to the artwork itself or generated through the use of algorithms.  For example, an NFT might have a limited edition number or feature a rare colour scheme that makes it stand out from other pieces.  An NFT character could have add-ons like glasses, hats, sports equipment or clothing.  Collectors value NFTs with rare or unique attributes, which can drive up their price points in the market.  The more exclusive or exceptional the attributes, the more valuable the NFT is likely to be.  As the NFT market grows, creators and collectors increasingly focus on developing and marketing NFTs with unique and highly coveted attributes.  Music NFTs can also have their own attributes attached, such as artist or track information, unique and original artwork such as an album cover, limited edition, royalties or even ownership rights.  Ensure you are maximising the earning potential from your NFT by adding attributes.</div>
            <div><p className="text-4xl mb-2">Unlockable content</p>Unlockable content on NFTs refers to additional digital assets or features that are included with an NFT purchase but not immediately accessible to the buyer.  This content is typically hidden or locked behind a code or other means of verification, which the buyer must use to gain access to the content.  Unlockable content can take many different forms, including additional artwork, music, video or other digital files, access to exclusive events, unique experiences or perks.  The NFT creator or seller determines the unlockable content and provides the necessary means to access it, which might be a code, a link, a password, or another verification method.  The concept of unlockable content adds an extra layer of value to an NFT purchase beyond the initial asset itself.  By providing additional content or experiences not available elsewhere, creators and sellers can increase the perceived value of an NFT, leading to greater demand and higher prices.  Unlockable content is an exciting new feature in the world of NFTS. It is supported by Nuva NFT, which can enhance a collector’s experience and provide new opportunities for creators and sellers to differentiate their offerings and stand out in the market.</div>
            <div><p className="text-4xl mb-2">Social Media Presence</p>If you want to maximise the full potential of your NFT concept, consider creating a strong social media presence for your NFT creator name/brand.  Social media platforms like Twitter and Instagram (amongst others) provide a global reach that allows creators and collectors to connect with an audience and grow their brand.  You can create a loyal and engaged following by posting regular updates about new artwork, collaborations, and any other events related to your brand. Meta Nuva and Nuva NFT will also periodically promote NFTs that are for sale to assist you in increasing your following of fellow artists, collectors, and investors who are interested in your NFTs and appreciate your style or message.  As your social media following grows, so too will your brand recognition and the perceived value of your NFTs.  Anytime you drop a new NFT or have an event, an engaged following on social media will help increase demand for your NFTs, ultimately driving up their prices.  Social media also provides an opportunity to communicate directly with collectors and fans, which can lead to more custom collaborations and growth for your NFT brand.  By harnessing the power of social media, creators and collectors can build a strong community and grow their NFT brand, ultimately leading to increased appreciation and value for your NFT.  Whilst it is important to appreciate the role social media can play in helping you increase the value of your NFTs, it is not something you have to do immediately.  The most crucial step in creating a successful NFT is to get started with the creation and listing process.  Brand awareness and social media can have a huge role to play in the long term, but it is essential that you don’t get bogged down in this and focus on creating your first high-quality and compelling NFT.  The rest can come later as you build your brand and reputation over time.</div>
            {/* <div><p className="text-4xl mb-2">Charges</p>Nuva NFT doesn't charge a fee to list your NFTs.  The only payment needed for using the Nuva NFT platform is to cover the charges for the blockchain fees.  This allows you, as a creator and artist, to list your NFT at a minimal cost and boost the number of artworks you are able to add to our platform. By only charging blockchain fees, Nuva NFT maintains transparency and offers a fair pricing model that reflects the actual costs of the NFT creation process.  This approach also helps attract artists and collectors who might be on a limited budget, making it an inclusive marketplace accessible to all.  Ultimately the no listing fee model helps foster a thriving community of creators and collectors while providing the flexibility and transparency needed to grow and evolve over time.  Furthermore, it ensures that you can refer people to use it with absolute confidence.</div> */}
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

export default nftterms