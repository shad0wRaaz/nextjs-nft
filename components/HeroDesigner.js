import ImageGallery from 'react-image-gallery';
import React, { Fragment, useState } from 'react';
import {  allbenefits } from '../constants/benefits';
import { TypeAnimation } from 'react-type-animation';
import "react-image-gallery/styles/css/image-gallery.css";
import panda1 from '../public/assets/panda1.png'
import panda2 from '../public/assets/panda2.png'
import panda3 from '../public/assets/panda3.png'
import panda4 from '../public/assets/panda4.png'

import nomin1  from '../pages/mushroom-kingdom/assets/cryptocreatures/1.png'
import nomin2  from '../pages/mushroom-kingdom/assets/cryptocreatures/2.png'
import nomin3  from '../pages/mushroom-kingdom/assets/cryptocreatures/3.png'
import nomin4  from '../pages/mushroom-kingdom/assets/cryptocreatures/4.png'
import grutzi1  from '../pages/mushroom-kingdom/assets/neondreams/2.png'
import grutzi2  from '../pages/mushroom-kingdom/assets/neondreams/3.png'
import grutzi3  from '../pages/mushroom-kingdom/assets/neondreams/4.png'
import grutzi4  from '../pages/mushroom-kingdom/assets/neondreams/5.png'
import hidoi1  from '../pages/mushroom-kingdom/assets/celestialbeings/3.png'
import hidoi2  from '../pages/mushroom-kingdom/assets/celestialbeings/4.png'
import hidoi3  from '../pages/mushroom-kingdom/assets/celestialbeings/5.png'
import hidoi4  from '../pages/mushroom-kingdom/assets/celestialbeings/6.png'
import kaioji1  from '../pages/mushroom-kingdom/assets/artifacts/4.png'
import kaioji2  from '../pages/mushroom-kingdom/assets/artifacts/5.png'
import kaioji3  from '../pages/mushroom-kingdom/assets/artifacts/6.png'
import kaioji4  from '../pages/mushroom-kingdom/assets/artifacts/7.png'

import bear from '../pages/furry-grace/assets/images/bear.webp'
import dog from '../pages/furry-grace/assets/images/dog.webp'
import fox from '../pages/furry-grace/assets/images/fox.webp'
import rabbit from '../pages/furry-grace/assets/images/rabbit.webp'
import ursine1  from '../pages/furry-grace/assets/ursine/ursine1.webp'
import ursine2  from '../pages/furry-grace/assets/ursine/ursine2.webp'
import ursine3  from '../pages/furry-grace/assets/ursine/ursine3.webp'
import ursine4  from '../pages/furry-grace/assets/ursine/ursine4.webp'

import vulpine1  from '../pages/furry-grace/assets/vulpine/vulpine1.webp'
import vulpine2  from '../pages/furry-grace/assets/vulpine/vulpine2.webp'
import vulpine3  from '../pages/furry-grace/assets/vulpine/vulpine3.webp'
import vulpine4  from '../pages/furry-grace/assets/vulpine/vulpine4.webp'

import lapine1  from '../pages/furry-grace/assets/lapine/lapine1.webp'
import lapine2  from '../pages/furry-grace/assets/lapine/lapine2.webp'
import lapine3  from '../pages/furry-grace/assets/lapine/lapine3.webp'
import lapine4  from '../pages/furry-grace/assets/lapine/lapine4.webp'

import canine1  from '../pages/furry-grace/assets/canine/canine1.webp'
import canine2  from '../pages/furry-grace/assets/canine/canine2.webp'
import canine3  from '../pages/furry-grace/assets/canine/canine3.webp'
import canine4  from '../pages/furry-grace/assets/canine/canine4.webp'

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
import artifacts8  from '../pages/rewarding-renditions/assets/artifacts/8.png';
import Link from 'next/link';
import { TbSquareRoundedNumber2, TbSquareRoundedNumber3, TbSquareRoundedNumber4, TbSquareRoundedNumber5, TbStar } from 'react-icons/tb';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { IconArbitrum, IconAvalanche, IconBNB, IconEthereum, IconPolygon } from './icons/CustomIcons';
import { HiArrowNarrowDown } from 'react-icons/hi';
import Airdrop from './Airdrop';
import { Dialog, Transition } from '@headlessui/react';

const HeroDesigner = () => {
  const [showCollection, setShowCollection] = useState(false);
  const router = useRouter();
  const [selectedCollection, setSelectedCollection] = useState('mushroom-kingdom');
  const [showAirdrop, setShowAirdrop] = useState(false);
  const [showAirdropMenu, setShowAirdropMenu] = useState(false);
  const [airdropCollection, setAirdropCollection] = useState('mushroom-kingdom');

  const links = {
    creatures: '/collection/binance/crypto_creatures',
    neon: '/collection/binance/neon_dreams',
    celestial: '/collection/binance/celestial_beings',
    artifacts: '/collection/binance/artifacts_of_the_future',
    nomin: '/collection/ethereum/nomin',
    grutzi: '/collection/ethereum/grutzi',
    hidoi: '/collection/ethereum/hidoi',
    kaioji: '/collection/ethereum/kaioji',
    ursine: '/collection/polygon/ursine',
    vulpine: '/collection/polygon/vulpine',
    lapine: '/collection/polygon/lapine',
    canine: '/collection/polygon/canine',
    pandagram: '/collection/binance/pandagram_v2'
  }
  const style = {
    wrapper: `relative overflow-hidden`,
    container: `pt-[8rem]`,
    contentWrapper: `container mx-auto relative sm:px-[2rem] lg:px-[8rem] text-center`,
    copyContainer: `lg:w-1/2`,
    grid: 'text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-6',
    gridCol: 'flex flex-wrap items-center justify-center gap-6 relative cursor-pointer overflow-hidden p-8 lg:p-0',
    gridContent : 'relative rounded-3xl heroImageContainer overflow-hidden w-full',
    gridImage: 'rounded-3xl w-full object-cover heroImage',
    content: 'absolute -bottom-50 left-0 w-full heroContent text-xl text-center',
    mintButton: ' mintButton border w-fit m-auto border-neutral-200 py-1 px-2 text-sm rounded-md bg-white text-slate-800 font-bold',
    nftCount : 'text-xs text-left rounded-md w-fit py-1 px-2 my-1 text-slate-300 bg-slate-700',
    orange: 'transition bg-gradient-to-br from-[#FA762F] to-[#F75136] hover:to-[#FA762F] duration-100',
    neon: 'transition bg-gradient-to-br from-[#C025D0] to-[#DA2678] hover:to-[#C025D0] duration-150',
    apple: 'transition bg-gradient-to-br from-[#1FC25D] to-[#15813E] hover:to-[#1FC25D] duration-200',
    flamingo: 'transition bg-gradient-to-br from-[#397FF5] to-[#1D4CD4] hover:to-[#397FF5] duration-250',
    title: `relative bg-[#ffffff44] backdrop-blur-lg mx-6 md:mx-0 rounded-3xl lg:mb-8 p-[20px] pb-0 md:py-[50px] font-semibold text-3xl md:text-xl xl:text-5xl leading-[3.5rem] md:leading-[5rem] lg:leading-[5rem] xl:leading-[5rem] text-white`,
    subtitle: 'text-sm text-white mb-1 font-bold',
    collectionSelection: 'relative w-full rounded-3xl gap-2 border border-slate-400/30 p-8 items-center hover:border-slate-700 hover:shadow-md hover:bg-slate-800 transition',
    description: `container-[400px] mt-[0.8rem] p-[20px] shoutoutDescription max-w-[500px] text-white`,
    ctaContainer: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px] mt-3 mb-4`,
    accentedButton: `gradBlue hover:bg-200 transition relative text-lg font-semibold px-12 py-4 rounded-full text-white hover:bg-[#42a0ff] cursor-pointer`,
    button: ` relative text-lg font-semibold px-12 py-4 bg-white transition rounded-full text-slate-900 hover:bg-neutral-200 cursor-pointer`,
    cardContainer: `lg:w-1/2 md:p-4 sm:p-0 mx-auto`,
    infoContainer: `h-20 bg-[#313338] p-4 rounded-b-lg flex items-center text-white`,
    author: `flex flex-col justify-center ml-4`,
    name: ``,
    unilevelInfo: 'text-left mt-2 text-sm flex gap-2 items-center',
    buyButton: 'rounded-lg p-2 px-3 text-sm w-full transition',
    infoIcon: `flex justify-end items-center flex-1 text-[#8a939b] text-3xl font-bold`,
    redBlur: `block bg-[#ef233c] w-72 h-72 absolute lg:ml-[10rem] md:ml-[3rem] sm:ml-[2rem] rounded-full filter blur-3xl opacity-20 lg:w-96 lg:h-96`,
    blueBlur: `block bg-[#04868b] w-72 h-72 absolute lg:ml-[43rem] md:ml-[5rem] sm:ml-[5rem] mt-40 rounded-full filter blur-3xl opacity-20 lg:w-96 lg:h-96 nc-animation-delay-2000`,
    collectionSelector: `p-2 px-3 rounded-xl transition cursor-pointer text-sm min-w-[100px] md:min-w-fit `,
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
  const pandagram = [
    {
      original: panda1.src,
      thumbnail: panda1.src,
    },
    {
      original: panda2.src,
      thumbnail: panda2.src,
    },
    {
      original: panda3.src,
      thumbnail: panda3.src,
    },
    {
      original: panda4.src,
      thumbnail: panda4.src,
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
  const ursineImages = [
    {
      original: ursine1.src,
      thumbnail: ursine1.src,
    },
    {
      original: ursine2.src,
      thumbnail: ursine2.src,
    },
    {
      original: ursine3.src,
      thumbnail: ursine3.src,
    },
    {
      original: ursine4.src,
      thumbnail: ursine4.src,
    }
  ];
  const vulpineImage = [
    {
      original: vulpine1.src,
      thumbnail: vulpine1.src,
    },
    {
      original: vulpine2.src,
      thumbnail: vulpine2.src,
    },
    {
      original: vulpine3.src,
      thumbnail: vulpine3.src,
    },
    {
      original: vulpine4.src,
      thumbnail: vulpine4.src,
    }
  ];
  const lapineImage = [
    {
      original: lapine1.src,
      thumbnail: lapine1.src,
    },
    {
      original: lapine2.src,
      thumbnail: lapine2.src,
    },
    {
      original: lapine3.src,
      thumbnail: lapine3.src,
    },
    {
      original: lapine4.src,
      thumbnail: lapine4.src,
    }
  ];
  const canineImages = [
    {
      original: canine1.src,
      thumbnail: canine1.src,
    },
    {
      original: canine2.src,
      thumbnail: canine2.src,
    },
    {
      original: canine3.src,
      thumbnail: canine3.src,
    },
    {
      original: canine4.src,
      thumbnail: canine4.src,
    }
  ];
  const nominImages = [
    {
      original: nomin1.src,
      thumbnail: nomin1.src,
    },
    {
      original: nomin2.src,
      thumbnail: nomin2.src,
    },
    {
      original: nomin3.src,
      thumbnail: nomin3.src,
    },
    {
      original: nomin4.src,
      thumbnail: nomin4.src,
    },
  ];
  const grutziImages = [
    {
      original: grutzi1.src,
      thumbnail: grutzi1.src,
    },
    {
      original: grutzi2.src,
      thumbnail: grutzi2.src,
    },
    {
      original: grutzi3.src,
      thumbnail: grutzi3.src,
    },
    {
      original: grutzi4.src,
      thumbnail: grutzi4.src,
    },
  ];
  const hidoiImages = [
    {
      original: hidoi1.src,
      thumbnail: hidoi1.src,
    },
    {
      original: hidoi2.src,
      thumbnail: hidoi2.src,
    },
    {
      original: hidoi3.src,
      thumbnail: hidoi3.src,
    },
    {
      original: hidoi4.src,
      thumbnail: hidoi4.src,
    },
  ];
  const kaiojiImages = [
    {
      original: kaioji1.src,
      thumbnail: kaioji1.src,
    },
    {
      original: kaioji2.src,
      thumbnail: kaioji2.src,
    },
    {
      original: kaioji3.src,
      thumbnail: kaioji3.src,
    },
    {
      original: kaioji4.src,
      thumbnail: kaioji4.src,
    },
  ];
  const collectionPicture = {
    'crypto1' : creature1.src,
    'neon1' : neon1.src,
    'celestial1' : celestial1.src,
    'artifacts1' : artifacts1.src,
    'nomin1' : nomin1.src,
    'grutzi1' : grutzi1.src,
    'hidoi1' : hidoi1.src,
    'kaioji1' : kaioji1.src,
    'ursine' : bear.src,
    'canine' : dog.src,
    'vulpine' : fox.src,
    'lapine' : rabbit.src,
  }
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
            
          <div className="animatedBall absolute top-8 left-96 w-[120px] h-[120px] bg-[#ffffff] rounded-full z-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"></div>
          <div className="animatedBall absolute top-8 right-96 w-[100px] h-[100px] bg-[#ffffff] rounded-full z-0 bg-gradient-to-r from-emerald-500 to-lime-600"></div>
          <div className=" absolute top-8 -right-40 w-[500px] h-[500px] bg-[#ffffff] rounded-full z-0 opacity-10 bg-gradient-to-r from-white to-black"></div>
          <div className=" absolute top-96 -left-60 w-[300px] h-[300px] bg-[#ffffff] rounded-full z-0 opacity-10 bg-gradient-to-r from-white to-black"></div>
          <div className="animatedBall absolute top-20 left-0 w-[60px] h-[60px] bg-[#ffffff] rounded-full z-0 opacity-10 bg-gradient-to-r from-white to-black"></div>
          <div className={style.title}>
            Discover, Collect, Mint, Sell and Buy NFTs
            <p className="animate-bounce textGradGreen text-lg lg:text-3xl">
              <HiArrowNarrowDown className="inline"/>
              <HiArrowNarrowDown className="inline"/> Latest Collections out Now
              <HiArrowNarrowDown className="inline"/>
              <HiArrowNarrowDown className="inline"/>
            </p>
          </div>

          <p className="text-center text-3xl font-bold my-3 huerotation leading-[60px]">
            Featured NFTs
          </p>

          <div className={style.grid}>
            {/* cypto */}
            <div className={style.gridCol + ' pt-0 '}>
              <div className={style.gridContent}>
                <ImageGallery 
                  items={ursineImages}
                  showNav={false}
                  showThumbnails={false}
                  showFullscreenButton={false}
                  showPlayButton={false}
                  autoPlay={true}
                  isRTL={true}
                  slideInterval={1800}/>
                <div className={style.content}>
                  <p className="title">Ursine</p>
                  <p className={style.subtitle}>Mint Price: 145 <IconPolygon/></p>
                  <div className={style.mintButton}>
                    <Link href={links.ursine} passHref>
                      <a>Mint Now</a>
                    </Link>
                  </div>
                </div>
              </div>
              <div className={style.gridContent}>
                <ImageGallery 
                  items={nominImages}
                  showNav={false}
                  showThumbnails={false}
                  showFullscreenButton={false}
                  showPlayButton={false}
                  autoPlay={true}
                  isRTL={true}
                  slideInterval={1800}/>
                <div className={style.content}>
                  <p className="title">Nomin</p>
                  <p className={style.subtitle}>Mint Price: 0.047 <IconEthereum/></p>
                  <div className={style.mintButton}>
                    <Link href={links.nomin} passHref>
                      <a>Mint Now</a>
                    </Link>
                  </div>
                </div>
              </div>
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
                  <p className={style.subtitle}>Mint Price: 0.36 <IconBNB/></p>
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
                  items={vulpineImage}
                  showNav={false}
                  showThumbnails={false}
                  showFullscreenButton={false}
                  showPlayButton={false}
                  autoPlay={true}
                  slideInterval={2200}
                  isRTL={true}
                  />
                <div className={style.content}>
                  <p className="title">Vulpine</p>
                  <p className={style.subtitle}>Mint Price: 290 <IconPolygon/></p>
                  <div className={style.mintButton}>
                    <Link href={links.vulpine} passHref>
                      <a>Mint Now</a>
                    </Link>
                  </div>
                  </div>
              </div>
              <div className={style.gridContent}>
                <ImageGallery 
                  items={grutziImages}
                  showNav={false}
                  showThumbnails={false}
                  showFullscreenButton={false}
                  showPlayButton={false}
                  autoPlay={true}
                  slideInterval={2200}
                  isRTL={true}
                  />
                <div className={style.content}>
                  <p className="title">Grutzi</p>
                  <p className={style.subtitle}>Mint Price: 0.094 <IconEthereum/></p>
                  <div className={style.mintButton}>
                    <Link href={links.grutzi} passHref>
                      <a>Mint Now</a>
                    </Link>
                  </div>
                  </div>
              </div>
              <div className={style.gridContent}>
                <ImageGallery 
                  items={pandagram}
                  showNav={false}
                  showThumbnails={false}
                  showFullscreenButton={false}
                  showPlayButton={false}
                  autoPlay={true}
                  isRTL={true}
                  slideInterval={2400}/>
                <div className={style.content}>
                  <p className="title">Pandagram V2</p>
                  <p className={style.subtitle}>Mint Price: 0.21 <IconBNB/></p>
                  <div className={style.mintButton}>
                    <Link href={links.pandagram} passHref>
                      <a>Mint Now</a>
                    </Link>
                  </div>
                  </div>
              </div>
            </div>
            {/* artifacts */}
            {/* <div className={style.gridCol}>
              <p className="text-md"><TbStar className="inline"/> Calling all NFT enthusiasts and influencers - connect your wallet, share your link, and get benefitted.</p>
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

                <div className={style.content}>
                  <p className="title">Artifacts of the Future</p>
                  <p className={style.subtitle}>Mint Price: 1.49 <IconBNB/></p>
                  <div className={style.mintButton}>
                    <Link href={links.artifacts} passHref>
                      <a>Mint Now</a>
                    </Link>
                  </div>
                  </div>
              </div>
              <p className="text-md"><TbStar className="inline"/> One time purchase/mint NFT from any chain, get referral and transaction reward forever.  </p>
              
            </div> */}
            {/* beings */}
            <div className={style.gridCol + ' py-10'}>
              <div className={style.gridContent}>
                <ImageGallery 
                    items={lapineImage}
                    showNav={false}
                    showThumbnails={false}
                    showFullscreenButton={false}
                    showPlayButton={false}
                    autoPlay={true}
                    slideInterval={2600}
                    />
                <div className={style.content}>
                  <p className="title">Lapine</p>
                  <p className={style.subtitle}>Mint Price: 480 <IconPolygon/></p>
                  <div className={style.mintButton}>
                    <Link href={links.lapine} passHref>
                      <a>Mint Now</a>
                    </Link>
                  </div>
                </div>
              </div>
              <div className={style.gridContent}>
                <ImageGallery 
                    items={hidoiImages}
                    showNav={false}
                    showThumbnails={false}
                    showFullscreenButton={false}
                    showPlayButton={false}
                    autoPlay={true}
                    slideInterval={2600}
                    />
                {/* <img src={celestial2.src} className={style.gridImage} alt="Celestial Beings" /> */}
                <div className={style.content}>
                  <p className="title">Hidoi</p>
                  <p className={style.subtitle}>Mint Price: 0.157 <IconEthereum/></p>
                  <div className={style.mintButton}>
                    <Link href={links.hidoi} passHref>
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
                  <p className={style.subtitle}>Mint Price: 1.19 <IconBNB/></p>
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
              <div className={style.gridContent}>
                <ImageGallery 
                  items={canineImages}
                  showNav={false}
                  showThumbnails={false}
                  showFullscreenButton={false}
                  showPlayButton={false}
                  autoPlay={true}
                  slideInterval={2300}/>
                  <div className={style.content}>
                    <p className="title">Canine</p>
                    <p className={style.subtitle}>Mint Price: 675 <IconPolygon/></p>
                    <div className={style.mintButton}>
                      <Link href={links.canine  } passHref>
                        <a>Mint Now</a>
                      </Link>
                    </div>
                  </div>
              </div>
              <div className={style.gridContent}>
                <ImageGallery 
                  items={kaiojiImages}
                  showNav={false}
                  showThumbnails={false}
                  showFullscreenButton={false}
                  showPlayButton={false}
                  autoPlay={true}
                  slideInterval={2300}/>
                  <div className={style.content}>
                    <p className="title">Kaioji</p>
                    <p className={style.subtitle}>Mint Price: 0.22 <IconEthereum/></p>
                    <div className={style.mintButton}>
                      <Link href={links.kaioji  } passHref>
                        <a>Mint Now</a>
                      </Link>
                    </div>
                  </div>
              </div>
              <div className={style.gridContent}>
                <ImageGallery 
                  items={artifactsFuture}
                  showNav={false}
                  showThumbnails={false}
                  showFullscreenButton={false}
                  showPlayButton={false}
                  autoPlay={true}
                  slideInterval={2400}/>
                  <div className={style.content}>
                    <p className="title">Artifacts of the Future</p>
                    <p className={style.subtitle}>Mint Price: 1.66 <IconBNB/></p>
                    <div className={style.mintButton}>
                      <Link href={links.artifacts} passHref>
                        <a>Mint Now</a>
                      </Link>
                    </div>
                  </div>
              </div>
            </div>
          </div>

          <div className={style.grid + ' hidden'}>

            <div className={style.gridCol}>
              <p className="text-md"><TbStar className="inline"/> First ever NFT Referral on multiple chains</p>
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
                  <p className={style.subtitle}>Mint Price: 0.32 <IconBNB/></p>
                  <div className={style.mintButton}>
                    <Link href={links.creatures} passHref>
                      <a>Mint Now</a>
                    </Link>
                  </div>
                </div>
              </div>
              <p className="text-md"><TbStar className="inline"/> One Wallet - one referral network and earn recurring income from FIVE different chains.</p>
            </div>

            {/* <div className={style.gridCol + ' pt-0 md:pt-10 pb-10'}>
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

                <div className={style.content}>
                  <p className="title">Neon Dream</p>
                  <p className={style.subtitle}>Mint Price: 0.64 <IconBNB/></p>
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

                <div className={style.content}>
                  <p className="title">Neon Dreams</p>
                  <p className={style.subtitle}>Mint Price: 0.64 <IconBNB/></p>
                  <div className={style.mintButton}>
                    <Link href={links.neon} passHref>
                      <a>Mint Now</a>
                    </Link>
                  </div>
                  </div>
              </div>
            </div>

            <div className={style.gridCol}>
            <p className="text-md"><TbStar className="inline"/> Calling all NFT enthusiasts and influencers - connect your wallet, share your link, and get benefitted.</p>
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

              <div className={style.content}>
                <p className="title">Artifacts of the Future</p>
                <p className={style.subtitle}>Mint Price: 1.49 <IconBNB/></p>
                <div className={style.mintButton}>
                  <Link href={links.artifacts} passHref>
                    <a>Mint Now</a>
                  </Link>
                </div>
                </div>
            </div>
            <p className="text-md"><TbStar className="inline"/> One time purchase/mint NFT from any chain, get referral and transaction reward forever.  </p>
              
            </div>

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

                <div className={style.content}>
                  <p className="title">Celestial Beings</p>
                  <p className={style.subtitle}>Mint Price: 1.04 <IconBNB/></p>
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

                <div className={style.content}>
                  <p className="title">Celestial Beings</p>
                  <p className={style.subtitle}>Mint Price: 1.04<IconBNB/></p>
                  <div className={style.mintButton}>
                    <Link href={links.celestial} passHref>
                      <a>Mint Now</a>
                    </Link>
                  </div>
                  </div>
              </div>
            </div>

            <div className={style.gridCol}>
            <p className="text-md"><TbStar className="inline"/> Earn 10% straightaway from anyone you refer when they buy.</p>
            <div className={style.gridContent}>

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
                <p className={style.subtitle}>Mint Price: 0.32 <IconBNB/></p>
                <div className={style.mintButton}>
                  <Link href={links.creatures} passHref>
                    <a>Mint Now</a>
                  </Link>
                </div>
              </div>
            </div>
            <p className="text-md"><TbStar className="inline"/> Occasional Airdrops of Native Tokens(respective chain) from each collection.</p>
            </div> */}
          </div>

          <div className="mt-[2rem]">
            <p className="text-xl text-white">🌟🌟 

            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                'Minting Available in Polygon',
                1000, // wait 1s before replacing "Mice" with "Hamsters"
                'Minting Available in Ethereum',
                1000,
                'Minting Available in Binance Chain',
                1000,
              ]}
              wrapper="span"
              speed={50}
              style={{ fontSize: '1em', display: 'inline-block' }}
              repeat={Infinity}
            />
            
             🌟🌟</p>
          </div>
          {/* {showCollection ? ( */}
            <div className="text-white mt-[3rem] border border-white/20 rounded-3xl bg-slate-900/80 mx-8 md:mx-0 p-8 shadow-md">
              <p className="text-xl mb-3" style={{ textWrap: 'balance'}}>Nuva NFT's exclusive NFT Collections</p>
              <div className="flex md:justify-center gap-3 mb-6 overflow-auto">
                <div 
                  className={style.collectionSelector + (selectedCollection == 'mushroom-kingdom' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-800 hover:bg-slate-700') }
                  onClick={() => setSelectedCollection('mushroom-kingdom')}
                  >
                    <IconEthereum/> Mushroom Kingdom
                </div>
                <div 
                  className={style.collectionSelector + (selectedCollection == 'rewarding-renditions' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-800 hover:bg-slate-700')}
                  onClick={() => setSelectedCollection('rewarding-renditions')}
                  >
                    <IconBNB/> Rewarding Renditions
                </div>
                <div 
                  className={style.collectionSelector + (selectedCollection == 'furry-grace' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-800 hover:bg-slate-700')}
                  onClick={() => setSelectedCollection('furry-grace')}
                  >
                    <IconPolygon/> Furry Grace
                </div>
                <div 
                  className={style.collectionSelector + (selectedCollection == 'etherverse' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-800 hover:bg-slate-700')}
                  onClick={() => setSelectedCollection('etherverse')}
                  >
                    <IconEthereum/> Etherverse
                </div>
                <div 
                  className={style.collectionSelector + (selectedCollection == 'eminent-creations' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-800 hover:bg-slate-700')}
                  onClick={() => setSelectedCollection('eminent-creations')}
                  >
                    <IconAvalanche/> Eminent Creations
                </div>
                <div 
                  className={style.collectionSelector + (selectedCollection == 'admirable-depictions' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-800 hover:bg-slate-700')}
                  onClick={() => setSelectedCollection('admirable-depictions')}
                  >
                    <IconArbitrum/> Admirable Depictions
                </div>
              </div>

              {selectedCollection == 'mushroom-kingdom' || selectedCollection == 'rewarding-renditions' || selectedCollection == 'furry-grace' ? (
                  <div className={style.ctaContainer}>
                    {allbenefits.filter(d => d.collection === selectedCollection).map(c => (
                      <div className={style.collectionSelection} key={c.contractAddress}>
                        <div className="absolute top-12 right-2">
                          <Image src={collectionPicture[c.picture]} height="80px" width="80px" objectFit='cover' className="rounded-full " alt={c.name}/>
                        </div>
                        <div className="flex gap-2">
                          <div className="text-left">
                            <p className="font-bold text-lg">{c.name}</p>
                            <p className={style.nftCount}>{c.totalSize} NFTs</p>
                          </div>
                        </div>
                        <div className="text-left mt-3">
                          <p>Mint Price: {c.mintPrice} {c.chain === 'binance' && <IconBNB/>}{c.chain === 'ethereum' && <IconEthereum/>}{c.chain === 'polygon' && <IconPolygon/>}</p>
                          <p className={style.unilevelInfo}>Unlocks Uni Level: 
                            {
                            c.unlockLevel == 2 ? <TbSquareRoundedNumber2 fontSize={25} />
                            : c.unlockLevel == 3 ? <TbSquareRoundedNumber3 fontSize={25} />
                            : c.unlockLevel == 4 ? <TbSquareRoundedNumber4 fontSize={25} />
                            : c.unlockLevel == 5 ? <TbSquareRoundedNumber5 fontSize={25} />
                            : ''
                            }
                          </p>
                          <p className="text-left text-sm mt-2">{c.earnDescription}<br/><br/></p>
                          <div className="flex flex-wrap gap-2">
                            <Link href={`/collection/${c.chain}/${c.url}`} passHref>
                              <a className="w-full">
                                <button className={style.buyButton + (c.buttonColor === 'orange' ? style.orange : c.buttonColor === 'neon' ? style.neon : c.buttonColor === 'flamingo' ? style.flamingo : style.apple) }>
                                        Mint NFT
                                </button>
                              </a>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                
                ) : 
                  <div className="text-center w-full">Collection Coming Soon..</div>}
                {/* <div className={style.collectionSelection}>
                  <div className="absolute top-12 right-2">
                    <Image src={creature1.src} height="80px" width="80px" objectFit='cover' className="rounded-full " alt="Crypto Creatures"/>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-left">
                      <p className="font-bold text-lg">Crypto Creatures</p>
                      <p className={style.nftCount}>5,000 NFTs</p>
                    </div>
                  </div>
                  <div className="text-left mt-3">
                    <p>Mint Price: 0.32 <IconBNB/></p>
                    <p className={style.unilevelInfo}>Unlocks Uni Level: <TbSquareRoundedNumber2 fontSize={25} /> </p>
                    <p className="text-left text-sm mt-2">Earn from 10% Direct + 8% Indirect<br/><br/></p>
                   

                    <div className="flex flex-wrap gap-2">
                      <Link href={links.creatures} passHref>
                        <a className="w-full">
                          <button className={style.buyButton + style.orange }>
                                  Mint NFT
                          </button>
                        </a>
                      </Link>
                    </div>

                  </div>
                </div>
                  
                <div className={style.collectionSelection}>
                  <div className="absolute top-10 right-2 ">
                    <Image src={neon2.src} height="80px" width="80px" objectFit='cover' className="rounded-full" alt="Neon Dreams"/>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-left">
                      <p className="font-bold text-lg">Neon Dreams</p>
                      <p className={style.nftCount}>5,000 NFTs</p>
                    </div>
                  </div>
                  <div className="text-left mt-3">
                    <p>Mint Price: 0.64 <IconBNB/></p>
                    <p className={style.unilevelInfo}>Unlocks Uni Level: <TbSquareRoundedNumber3 fontSize={25} /> </p>
                    <p className="text-left text-sm mt-2">Earn from 10% Direct + (8% + 6%) Indirect<br/><br/></p>

                    <div className="flex flex-wrap gap-2">
                      <Link href={links.neon} passHref>
                        <a className="w-full">
                          <button className={style.buyButton + style.neon}>
                            Mint NFT
                          </button>
                        </a>
                      </Link>
                    </div>

                  </div>
                </div>
                  
                <div className={style.collectionSelection}>
                  <div className="absolute top-12 right-2 ">
                    <Image src={celestial3.src} height="80px" width="80px" objectFit='cover' className="rounded-full" alt="Celestial Beings"/>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-left">
                      <p className="font-bold text-lg">Celestial Beings</p>
                      <p className={style.nftCount}>10,000 NFTs</p>
                    </div>
                  </div>
                  <div className="text-left mt-3">
                    <p>Mint Price: 1.04 <IconBNB/></p>
                    <p className={style.unilevelInfo}>Unlocks Uni Level: <TbSquareRoundedNumber4 fontSize={25} /> </p>
                    <p className="text-left text-sm mt-2">Earn from 10% Direct + (8% + 6% + 5%) Indirect<br/><br/></p>

                    <div className="flex flex-wrap gap-2">
                      <Link href={links.celestial} passHref>
                        <a className="w-full">
                          <button className={style.buyButton + style.flamingo}>
                            Mint NFT
                          </button>
                        </a>
                      </Link>
                    </div>

                  </div>
                </div>
            
                <div className={style.collectionSelection}>
                  <div className="absolute top-12 right-2 z-0 ">
                    <Image src={artifacts4.src} height="80px" width="80px" objectFit='cover' className="rounded-full" alt="Artifacts of the Future"/>
                  </div>
                  <div className="flex gap-2 z-10 relative">
                    <div className="text-left">
                      <p className="font-bold text-lg">Artifacts of the Future</p>
                      <p className={style.nftCount}>20,000 NFTs</p>
                    </div>
                  </div>
                  <div className="text-left mt-3">
                    <p>Mint Price: 1.49 <IconBNB/></p>
                    <p className={style.unilevelInfo}>Unlocks Uni Level: <TbSquareRoundedNumber5 fontSize={25} /> </p>
                    <p className="text-left text-sm mt-2">Earn from 10% Direct + (8% + 6% + 5% + 5%) Indirect<br/><br/></p>

                    <div className="flex flex-wrap gap-2">
                      <Link href={links.artifacts} passHref>
                        <a className="w-full">
                          <button className={style.buyButton + style.apple}>
                            Mint NFT
                          </button>
                        </a>
                      </Link>
                    </div>
                  </div>
                </div> */}
              {selectedCollection == 'mushroom-kingdom' || selectedCollection == 'rewarding-renditions' || selectedCollection == 'furry-grace' ? 
              <Airdrop visible={showAirdrop} setShowAirdrop={setShowAirdrop} selectedAirdropCollection={selectedCollection}/>
              :
              ''}

              <div className="flex flex-wrap justify-center items-center gap-4 w-fit mt-6 m-auto">
                <div 
                  className="cursor-pointer text-center md:text-right rounded-xl p-3 text-slate-900 bg-white hover:bg-neutral-200 transition px-6 m-auto w-full md:w-fit"
                  onClick={() => setShowAirdrop(true)}
                  >
                      View Airdrops
                </div>
                <div className="cursor-pointer text-center md:text-right rounded-xl p-3 bg-white/20 hover:bg-white/10 transition px-6 m-auto  w-fit gradBlue">
                  <Link href={`/${selectedCollection}`} passHref>
                    <a target="_blank">
                      Learn More about the Collection
                    </a>
                  </Link>
                </div>
                <div className="cursor-pointer rounded-xl w-full md:w-fit p-3 text-slate-900 bg-white hover:bg-neutral-200 transition px-6 m-auto border border-white/20">
                  <Link href={selectedCollection == 'mushroom-kingdom' ? '/mushroomkingdom/Whitepaper.pdf' : selectedCollection == 'rewarding-renditions' ? 'https://nuva-nft.gitbook.io/docs/' : '/furrygrace/Whitepaper.pdf'} passHref>
                    <a target="_blank">
                      Read Whitepaper
                    </a>
                  </Link>
                </div>
              </div>

              <Transition appear show={showAirdropMenu} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setShowAirdrop(false)}>
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                  </Transition.Child>

                  <div className="fixed inset-0 overflow-y-auto" onClick={() => setShowAirdropMenu(false)}>
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900"
                          >
                            Choose Chain to view Airdrops from
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              We have Airdrops on  multiple chains. As the threshold of NFT sale is reached, Airdrop for the Native chain is released to all the current NFT holders of the particular collection.
                            </p>
                            <div className="flex flex-col mt-3 gap-2">
                              <div 
                                className="w-full rounded-xl p-2 text-center border border-neutral-200 cursor-pointer hover:bg-neutral-100 transition"
                                onClick={() => {setShowAirdrop(true); setAirdropCollection('ethereum'); setShowAirdropMenu(false)}}>
                                <IconEthereum className="inline"/> Ethereum
                              </div>
                              <div 
                                className="w-full rounded-xl p-2 text-center border border-neutral-200 cursor-pointer hover:bg-neutral-100 transition"
                                onClick={() => {setShowAirdrop(true); setAirdropCollection('binance'); setShowAirdropMenu(false)}}>
                                <IconBNB className="inline"/> Binance
                              </div>
                              <div 
                                className="w-full rounded-xl p-2 text-center border border-neutral-200 cursor-pointer hover:bg-neutral-100 transition"
                                onClick={() => {setShowAirdrop(true); setAirdropCollection('polygon'); setShowAirdropMenu(false)}}>
                                <IconPolygon className="inline"/> Polygon
                              </div>
                              <div 
                                className="w-full rounded-xl p-2 text-center border border-neutral-200 cursor-pointer hover:bg-neutral-100 transition"
                                onClick={() => {setShowAirdrop(true); setAirdropCollection('avalanche'); setShowAirdropMenu(false)}}>
                                <IconAvalanche className="inline"/> Avalanche
                              </div>
                              <div 
                                className="w-full rounded-xl p-2 text-center border border-neutral-200 cursor-pointer hover:bg-neutral-100 transition"
                                onClick={() => {setShowAirdrop(true); setAirdropCollection('arbitrum'); setShowAirdropMenu(false)}}>
                                <IconArbitrum className="inline"/> Arbitrum
                              </div>
                            </div>
                          </div>

                          
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>
              
            </div>
        </div>
      </div>
    </div>
  )
}

export default HeroDesigner