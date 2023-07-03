import React, { useState } from 'react';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import creature1  from '../pages/rewarding-renditions/assets/cryptocreatures/1.png'
import creature2  from '../pages/rewarding-renditions/assets/cryptocreatures/2.png'
import creature3  from '../pages/rewarding-renditions/assets/cryptocreatures/3.png'
import creature4  from '../pages/rewarding-renditions/assets/cryptocreatures/4.png'
import creature5  from '../pages/rewarding-renditions/assets/cryptocreatures/5.png'
import creature6  from '../pages/rewarding-renditions/assets/cryptocreatures/6.png'
import creature7  from '../pages/rewarding-renditions/assets/cryptocreatures/7.png'
import creature8  from '../pages/rewarding-renditions/assets/cryptocreatures/8.png'
import neon1  from '../pages/rewarding-renditions/assets/neondreams/1.png'
import neon2  from '../pages/rewarding-renditions/assets/neondreams/2.png'
import neon3  from '../pages/rewarding-renditions/assets/neondreams/3.png'
import neon4  from '../pages/rewarding-renditions/assets/neondreams/4.png'
import neon5  from '../pages/rewarding-renditions/assets/neondreams/5.png'
import neon6  from '../pages/rewarding-renditions/assets/neondreams/6.png'
import neon7  from '../pages/rewarding-renditions/assets/neondreams/7.png'
import neon8  from '../pages/rewarding-renditions/assets/neondreams/8.png'
import celestial1  from '../pages/rewarding-renditions/assets/celestialbeings/1.png'
import celestial2  from '../pages/rewarding-renditions/assets/celestialbeings/2.png'
import celestial3  from '../pages/rewarding-renditions/assets/celestialbeings/3.png'
import celestial4  from '../pages/rewarding-renditions/assets/celestialbeings/4.png'
import celestial5  from '../pages/rewarding-renditions/assets/celestialbeings/5.png'
import celestial6  from '../pages/rewarding-renditions/assets/celestialbeings/6.png'
import celestial7  from '../pages/rewarding-renditions/assets/celestialbeings/7.png'
import celestial8  from '../pages/rewarding-renditions/assets/celestialbeings/8.png'
import artifacts1  from '../pages/rewarding-renditions/assets/artifacts/1.png'
import artifacts2  from '../pages/rewarding-renditions/assets/artifacts/2.png'
import artifacts3  from '../pages/rewarding-renditions/assets/artifacts/3.png'
import artifacts4  from '../pages/rewarding-renditions/assets/artifacts/4.png'
import artifacts5  from '../pages/rewarding-renditions/assets/artifacts/5.png'
import artifacts6  from '../pages/rewarding-renditions/assets/artifacts/6.png'
import artifacts7  from '../pages/rewarding-renditions/assets/artifacts/7.png'
import artifacts8  from '../pages/rewarding-renditions/assets/artifacts/8.png'
import Link from 'next/link';
import { TbStar } from 'react-icons/tb';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { IconBNB } from './icons/CustomIcons';

const HeroDesigner = () => {
  const [showCollection, setShowCollection] = useState(false);
  const router = useRouter();
  const links = {
    creatures: '/collection/binance/0x9809AbFc4319271259a340775eC03E9746B76068',
    neon: '/collection/binance/0x2945db324Ec216a5D5cEcE8B4D76f042553a213f',
    celestial: '/collection/binance/0x54265672B480fF8893389F2c68caeF29C95c7BE2',
    artifacts: '/collection/binance/0x9BDa42900556fCce5927C1905084C4b3CffB23b0',
  }
  const style = {
    wrapper: `relative overflow-hidden`,
    container: `pt-[8rem]`,
    contentWrapper: `container mx-auto relative sm:px-[2rem] lg:px-[8rem] text-center`,
    copyContainer: `lg:w-1/2`,
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0 md:gap-6',
    gridCol: 'flex flex-wrap items-center justify-center gap-6 relative cursor-pointer overflow-hidden p-8 lg:p-0',
    gridContent : 'relative rounded-3xl heroImageContainer overflow-hidden w-full',
    gridImage: 'rounded-3xl w-full object-cover heroImage',
    content: 'absolute -bottom-50 left-0 w-full heroContent text-xl text-center',
    mintButton: 'mintButton border w-fit m-auto border-neutral-200 py-1 px-2 text-sm rounded-md bg-white text-slate-800 font-bold',
    title: `relative lg:mb-8 p-[20px] pb-0 md:pb-[20px] font-semibold text-3xl md:text-xl xl:text-5xl leading-[3.5rem] md:leading-[5rem] lg:leading-[5rem] xl:leading-[5rem] text-white`,
    subtitle: 'text-sm text-white mb-1 font-bold',
    collectionSelection: ' w-full md:w-fit rounded-xl flex gap-2 border border-white/50 p-2 px-3 items-center cursor-pointer hover:border-neutral-500 hover:shadow-md hover:bg-neutral-900 transition',
    description: `container-[400px] mt-[0.8rem] p-[20px] shoutoutDescription max-w-[500px] text-white`,
    ctaContainer: `flex flex-wrap justify-center gap-[20px] px-[20px] mt-3 mb-8`,
    accentedButton: `gradBlue hover:bg-200 transition relative text-lg font-semibold px-12 py-4 rounded-full text-white hover:bg-[#42a0ff] cursor-pointer`,
    button: ` relative text-lg font-semibold px-12 py-4 bg-slate-600 rounded-full text-[#e4e8ea] hover:bg-slate-700 cursor-pointer`,
    cardContainer: `lg:w-1/2 md:p-4 sm:p-0 mx-auto`,
    infoContainer: `h-20 bg-[#313338] p-4 rounded-b-lg flex items-center text-white`,
    author: `flex flex-col justify-center ml-4`,
    name: ``,
    infoIcon: `flex justify-end items-center flex-1 text-[#8a939b] text-3xl font-bold`,
    redBlur: `block bg-[#ef233c] w-72 h-72 absolute lg:ml-[10rem] md:ml-[3rem] sm:ml-[2rem] rounded-full filter blur-3xl opacity-20 lg:w-96 lg:h-96`,
    blueBlur: `block bg-[#04868b] w-72 h-72 absolute lg:ml-[43rem] md:ml-[5rem] sm:ml-[5rem] mt-40 rounded-full filter blur-3xl opacity-20 lg:w-96 lg:h-96 nc-animation-delay-2000`,
  }
  const cryptoImages = [
    {
      original: creature1.src,
      thumbnail: creature1.src,
    },
    {
      original: creature2.src,
      thumbnail: creature2.src,
    },
    {
      original: creature3.src,
      thumbnail: creature3.src,
    },
    {
      original: creature4.src,
      thumbnail: creature4.src,
    },
  ];
  const cryptoImages2 = [
    {
      original: creature5.src,
      thumbnail: creature5.src,
    },
    {
      original: creature6.src,
      thumbnail: creature6.src,
    },
    {
      original: creature7.src,
      thumbnail: creature7.src,
    },
    {
      original: creature8.src,
      thumbnail: creature8.src,
    },
  ];
  const neonImages = [
    {
      original: neon1.src,
      thumbnail: neon1.src,
    },
    {
      original: neon2.src,
      thumbnail: neon2.src,
    },
    {
      original: neon3.src,
      thumbnail: neon3.src,
    },
    {
      original: neon4.src,
      thumbnail: neon4.src,
    },
  ];
  const neonImages2 = [
    {
      original: neon5.src,
      thumbnail: neon6.src,
    },
    {
      original: neon6.src,
      thumbnail: neon6.src,
    },
    {
      original: neon7.src,
      thumbnail: neon7.src,
    },
    {
      original: neon8.src,
      thumbnail: neon8.src,
    },
  ];
  const celestialBeings2 = [
    {
      original: celestial5.src,
      thumbnail: celestial5.src,
    },
    {
      original: celestial6.src,
      thumbnail: celestial6.src,
    },
    {
      original: celestial7.src,
      thumbnail: celestial7.src,
    },
    {
      original: celestial8.src,
      thumbnail: celestial8.src,
    },
  ];
  const celestialBeings = [
    {
      original: celestial1.src,
      thumbnail: celestial1.src,
    },
    {
      original: celestial2.src,
      thumbnail: celestial2.src,
    },
    {
      original: celestial3.src,
      thumbnail: celestial3.src,
    },
    {
      original: celestial4.src,
      thumbnail: celestial4.src,
    },
  ];
  const artifactsFuture = [
    {
      original: artifacts1.src,
      thumbnail: artifacts1.src,
      class: 'h-full',
      height: '100%',
    },
    {
      original: artifacts2.src,
      thumbnail: artifacts2.src,
      class: 'h-full',
      height: '100%',
    },
    {
      original: artifacts3.src,
      thumbnail: artifacts3.src,
      class: 'h-full',
      height: '100%',
    },
    {
      original: artifacts4.src,
      thumbnail: artifacts4.src,
      class: 'h-full',
      height: '100%',
    },
    {
      original: artifacts5.src,
      thumbnail: artifacts5.src,
      class: 'h-full',
      height: '100%',
    },
    {
      original: artifacts6.src,
      thumbnail: artifacts6.src,
      class: 'h-full',
      height: '100%',
    },
    {
      original: artifacts7.src,
      thumbnail: artifacts7.src,
      class: 'h-full',
      height: '100%',
    },
    {
      original: artifacts8.src,
      thumbnail: artifacts8.src,
      class: 'h-full',
      height: '100%',
    },
  ];
  const settings = {
    dots: false,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    easing: 'linear',
    infinite: true,
    vertical: true,
    pauseOnHover: false,
    autoplaySpeed: 2000
  };

  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <div className={style.contentWrapper}>
          <div className={style.title}>
            Discover, Collect, Mint, Sell and Buy NFTs
          </div>
          <div className={style.grid}>
            {/* cypto */}
            <div className={style.gridCol}>
                <p className="md:absolute top-0 left-0 text-md text-left"><TbStar className="inline"/> First ever NFT Referral on multiple chains</p>
                <p className="md:absolute bottom-0 left-0 text-md text-left"><TbStar className="inline"/> One Wallet - one referral network and earn recurring income from FOUR different chains.</p>
              <div className={style.gridContent}>
                <ImageGallery 
                  items={cryptoImages}
                  showNav={false}
                  showThumbnails={false}
                  showFullscreenButton={false}
                  showPlayButton={false}
                  autoPlay={true}
                  isRTL={true}
                  slideInterval={2000}/>
                <div className={style.content}>
                  <p className="title">Crypto Creatures</p>
                  <p className={style.subtitle}>Mint Price: 0.3 <IconBNB/></p>
                  <div className={style.mintButton}>
                    <Link href={links.creatures} passHref>
                      <a>Mint Now</a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* neon */}
            <div className={style.gridCol + ' pt-0 md:pt-10 pb-10'}>
              <div className={style.gridContent}>
                <ImageGallery 
                  items={neonImages}
                  showNav={false}
                  showThumbnails={false}
                  showFullscreenButton={false}
                  showPlayButton={false}
                  autoPlay={true}
                  slideInterval={2200}
                  isRTL={true}
                  />
                {/* <img src={neon2.src} className={style.gridImage + ' max-h-[150px]'} alt="Neon Dreams" /> */}
                <div className={style.content}>
                  <p className="title">Neon Dream</p>
                  <p className={style.subtitle}>Mint Price: 0.6 <IconBNB/></p>
                  <div className={style.mintButton}>
                    <Link href={links.neon} passHref>
                      <a>Mint Now</a>
                    </Link>
                  </div>
                  </div>
              </div>
              <div className={style.gridContent}>
                <ImageGallery 
                  items={neonImages2}
                  showNav={false}
                  showThumbnails={false}
                  showFullscreenButton={false}
                  showPlayButton={false}
                  autoPlay={true}
                  isRTL={true}
                  slideInterval={2400}/>
                {/* <img src={neon1.src} className={style.gridImage} alt="Neon Dreams" /> */}
                <div className={style.content}>
                  <p className="title">Neon Dreams</p>
                  <p className={style.subtitle}>Mint Price: 0.3 <IconBNB/></p>
                  <div className={style.mintButton}>
                    <Link href={links.neon} passHref>
                      <a>Mint Now</a>
                    </Link>
                  </div>
                  </div>
              </div>
            </div>
            {/* artifacts */}
            <div className={style.gridCol}>
            <p className="md:absolute top-0 left-0 text-md text-left"><TbStar className="inline"/> Calling all NFT enthusiasts and influencers - connect your wallet, share your link, and get benefitted.</p>
            <p className="md:absolute bottom-0 left-0 text-xl text-center animate-bounce"><TbStar className="inline"/> Minting Available now in Binance Chain</p>
              <div className={style.gridContent}>
                <ImageGallery 
                    items={artifactsFuture}
                    showNav={false}
                    showThumbnails={false}
                    showFullscreenButton={false}
                    showPlayButton={false}
                    autoPlay={true}
                    slideInterval={2800}
                    />
                {/* <img src={artifacts3.src} className={style.gridImage + ' h-full'} alt="Artifacts of the Future" /> */}
                <div className={style.content}>
                  <p className="title">Artifacts of the Future</p>
                  <p className={style.subtitle}>Mint Price: 1.4 <IconBNB/></p>
                  <div className={style.mintButton}>
                    <Link href={links.artifacts} passHref>
                      <a>Mint Now</a>
                    </Link>
                  </div>
                  </div>
              </div>
              
            </div>
            {/* beings */}
            <div className={style.gridCol + ' py-10'}>
              <div className={style.gridContent}>
                <ImageGallery 
                    items={celestialBeings}
                    showNav={false}
                    showThumbnails={false}
                    showFullscreenButton={false}
                    showPlayButton={false}
                    autoPlay={true}
                    slideInterval={2600}
                    />
                {/* <img src={celestial2.src} className={style.gridImage} alt="Celestial Beings" /> */}
                <div className={style.content}>
                  <p className="title">Celestial Beings</p>
                  <p className={style.subtitle}>Mint Price: 1 <IconBNB/></p>
                  <div className={style.mintButton}>
                    <Link href={links.celestial} passHref>
                      <a>Mint Now</a>
                    </Link>
                  </div>
                </div>
              </div>
              <div className={style.gridContent}>
                <ImageGallery 
                    items={celestialBeings2}
                    showNav={false}
                    showThumbnails={false}
                    showFullscreenButton={false}
                    showPlayButton={false}
                    autoPlay={true}
                    slideInterval={2500}
                    />
                {/* <img src={celestial1.src} className={style.gridImage + ' max-h-[150px]'} alt="Celestial Beings" /> */}
                <div className={style.content}>
                  <p className="title">Celestial Beings</p>
                  <p className={style.subtitle}>Mint Price: 1 <IconBNB/></p>
                  <div className={style.mintButton}>
                    <Link href={links.celestial} passHref>
                      <a>Mint Now</a>
                    </Link>
                  </div>
                  </div>
              </div>
            </div>
            {/* cypto */}
            <div className={style.gridCol}>
            <p className="md:absolute bottom-0 left-0 text-md text-left"><TbStar className="inline"/> Earn 10% straightaway from anyone you refer when they buy.</p>
            <p className="md:absolute top-0 left-0 text-md text-left"><TbStar className="inline"/> Mint and enjoy the benefits of your referral network.</p>
              <div className={style.gridContent}>
              {/* <img src={creature3.src} className={style.gridImage} alt="Crypto Creature" /> */}
              <ImageGallery 
                items={cryptoImages2}
                showNav={false}
                showThumbnails={false}
                showFullscreenButton={false}
                showPlayButton={false}
                autoPlay={true}
                slideInterval={2300}/>
                <div className={style.content}>
                  <p className="title">Crypto Creatures</p>
                  <p className={style.subtitle}>Mint Price: 0.3 <IconBNB/></p>
                  <div className={style.mintButton}>
                    <Link href={links.creatures} passHref>
                      <a>Mint Now</a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {showCollection ? (
            <div className="mt-[3rem] px-4">
              <p>Select Collection</p>
              <div className={style.ctaContainer}>
                <Link href={links.creatures} passHref>
                  <a className="w-full md:w-fit">
                    <div className={style.collectionSelection}>
                      <Image src={creature1.src} height="60px" width="60px" objectFit='cover' className="rounded-full" alt="Crypto Creatures"/>
                      <div className="text-left">
                        <p>Crypto Creatures</p>
                        <p>Mint Price: 0.3 <IconBNB/></p>
                      </div>
                    </div>
                  </a>
                </Link>
                <Link href={links.neon} passHref>
                  <a className="w-full md:w-fit">
                    <div className={style.collectionSelection}>
                      <Image src={neon2.src} height="60px" width="60px" objectFit='cover' className="rounded-full" alt="Crypto Creatures"/>
                      <div className="text-left">
                        <p>Neon Dreams</p>
                        <p>Mint Price: 0.6 <IconBNB/></p>
                      </div>
                    </div>
                  </a>
                </Link>
                <Link href={links.celestial} passHref>
                  <a className="w-full md:w-fit">
                    <div className={style.collectionSelection}>
                      <Image src={celestial3.src} height="60px" width="60px" objectFit='cover' className="rounded-full" alt="Crypto Creatures"/>
                      <div className="text-left">
                        <p>Celestial Beings</p>
                        <p>Mint Price: 1 <IconBNB/></p>
                      </div>
                    </div>
                  </a>
                </Link>
                <Link href={links.artifacts} passHref>
                  <a className="w-full md:w-fit">
                    <div className={style.collectionSelection}>
                      <Image src={artifacts4.src} height="60px" width="60px" objectFit='cover' className="rounded-full" alt="Crypto Creatures"/>
                      <div className="text-left">
                        <p>Artifacts of the Future</p>
                        <p>Mint Price: 1.4 <IconBNB/></p>
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          ) : (
            <div className={style.ctaContainer + ' mt-[3rem]'}>
                <button
                  className={style.accentedButton}
                  onClick={() => setShowCollection(true)}
                >
                  Mint Now
                </button>
                <button
                  className={style.button}
                  onClick={() => router.push('/tutorials/getstarted')}
                >
                  Tutorials
                </button>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HeroDesigner