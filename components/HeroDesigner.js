import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import creature1  from '../pages/rewarding-renditions/assets/cryptocreatures/1.png'
import creature2  from '../pages/rewarding-renditions/assets/cryptocreatures/2.png'
import creature3  from '../pages/rewarding-renditions/assets/cryptocreatures/3.png'
import creature4  from '../pages/rewarding-renditions/assets/cryptocreatures/4.png'
import neon1  from '../pages/rewarding-renditions/assets/neondreams/1.png'
import neon2  from '../pages/rewarding-renditions/assets/neondreams/2.png'
import neon3  from '../pages/rewarding-renditions/assets/neondreams/3.png'
import neon4  from '../pages/rewarding-renditions/assets/neondreams/4.png'
import celestial1  from '../pages/rewarding-renditions/assets/celestialbeings/3.png'
import celestial2  from '../pages/rewarding-renditions/assets/celestialbeings/2.png'
import artifacts1  from '../pages/rewarding-renditions/assets/artifacts/1.png'
import artifacts2  from '../pages/rewarding-renditions/assets/artifacts/2.png'
import artifacts3  from '../pages/rewarding-renditions/assets/artifacts/3.png'
import artifacts4  from '../pages/rewarding-renditions/assets/artifacts/4.png'

const HeroDesigner = () => {
  const style = {
    wrapper: `relative overflow-hidden`,
    container: `pt-[8rem]`,
    contentWrapper: `container mx-auto relative sm:px-[2rem] lg:px-[8rem] text-center`,
    copyContainer: `lg:w-1/2`,
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6',
    gridCol: 'flex flex-wrap items-center justify-center gap-6',
    gridImage: 'rounded-3xl w-full object-cover',
    title: `relative mb-8 p-[20px] font-semibold text-xl md:text-xl xl:text-5xl leading-[3.5rem] md:leading-[5rem] lg:leading-[5rem] xl:leading-[5rem] text-white`,
    description: `container-[400px] mt-[0.8rem] p-[20px] shoutoutDescription max-w-[500px] text-white`,
    ctaContainer: `flex justify-start gap-[20px] px-[20px] mt-5 mb-8`,
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
              <img src={creature1.src} className={style.gridImage} alt="Crypto Creature" />
            </div>
            {/* neon */}
            <div className={style.gridCol + ' py-10'}>
              <img src={neon1.src} className={style.gridImage} alt="Neon Dreams" />
              <img src={neon2.src} className={style.gridImage + ' max-h-[150px]'} alt="Neon Dreams" />
            </div>
            {/* artifacts */}
            <div className={style.gridCol}>
              <img src={artifacts3.src} className={style.gridImage + ' h-full'} alt="Artifacts of the Future" />
            </div>
            {/* beings */}
            <div className={style.gridCol + ' py-10'}>
              <img src={celestial1.src} className={style.gridImage + ' max-h-[150px]'} alt="Celestial Beings" />
              <img src={celestial2.src} className={style.gridImage} alt="Celestial Beings" />
            </div>
            {/* cypto */}
            <div className={style.gridCol}>
              <img src={creature3.src} className={style.gridImage} alt="Crypto Creature" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroDesigner