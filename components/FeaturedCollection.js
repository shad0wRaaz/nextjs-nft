import Link from 'next/link'
import { ethers } from 'ethers'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import background from '../assets/nftworlds.jpg'
import panda1 from '../public/assets/panda1.png'
import panda2 from '../public/assets/panda2.png'
import panda3 from '../public/assets/panda3.png'
import panda4 from '../public/assets/panda4.png'
import panda5 from '../public/assets/panda5.png'
import panda6 from '../public/assets/panda6.png'
import panda7 from '../public/assets/panda7.png'
import panda8 from '../public/assets/panda8.png'
import panda9 from '../public/assets/panda9.png'
import { ThirdwebSDK } from '@thirdweb-dev/react'
import React, { useEffect, useState } from 'react'
import panda10 from '../public/assets/panda10.png'
import panda11 from '../public/assets/panda11.png'
import panda12 from '../public/assets/panda12.png'
import { IconBNB, IconLoading } from './icons/CustomIcons'


const FeaturedCollection = () => {
  const [totalUnclaimedSupply, setTotalUnclaimedSupply ] = useState();
  const [mintPrice, setMintPrice] = useState();
  const style = {
      wrapperContainer: 'topCollectionWrapper text-center bg-center bg-top md:bg-center md:bg-cover z-0 relative',
      wrapper: 'container mx-auto lg:p-[8rem] p-[2rem]  pb-[4rem]',
      image: 'rounded-2xl',
      title: 'font-bold mb-[2rem] grow text-center flex flex-col md:flex-row justify-center items-center gap-2 text-white text-[3rem]',
      collectionWrapper:
        'grid gap-4 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      collection:
        'cursor-pointer py-4 px-[1rem] md:w-1/6 sm:w-[40%] flex items-center justify-start rounded-xl border bg-white hover:bg-[#ffffffcc] transition duration-300',
      imageContainer:
        'bg-[#eeeeee] mr-[1rem] rounded-full relative h-[60px] w-[60px] overflow-hidden',
      collectionDescriptionContainer: 'flex flex-col',
      collectionTitle: 'font-bold text-medium text-left',
      itemTitle: 'text-black text-sm text-left',
      coinLogo: 'inline mr-[3px] ml-[5px] h-[15px] w-auto',
    }
    
  const animation = { duration: 15000, easing: (t) => t }
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    renderMode: "performance",
    breakpoints: {
      "(min-width: 300px)": {
        slides: { perView: 1, spacing: 10 },
      },
      "(min-width: 768px)": {
        slides: { perView: 3, spacing: 10 },
      },
      "(min-width: 1000px)": {
        slides: { perView: 5, spacing: 10 },
      },
    },
    created(s) {
      s.moveToIdx(5, true, animation)
    },
    updated(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation)
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation)
    },
    mode: 'free-snap',
  });
  const [sliderRef_, instanceRef_] = useKeenSlider({
    loop: true,
    rtl: true,
    renderMode: "performance",
    breakpoints: {
      "(min-width: 300px)": {
        slides: { perView: 1, spacing: 10 },
      },
      "(min-width: 768px)": {
        slides: { perView: 3, spacing: 10 },
      },
      "(min-width: 1000px)": {
        slides: { perView: 5, spacing: 10 },
      },
    },
    created(s) {
      s.moveToIdx(5, true, animation)
    },
    updated(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation)
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation)
    },
    mode: 'free-snap',
  });

  useEffect(() => {
    const contractAddress = '0xbDd60f4d2795f145C09dd4eA6d9565B185F6CBF9';
    ;(async() => {
      const sdk = new ThirdwebSDK("binance");
      const contract = await sdk.getContract(contractAddress);
      setTotalUnclaimedSupply(await contract.erc721.totalUnclaimedSupply());
      const {price} = await contract.erc721.claimConditions.getActive();
      setMintPrice(ethers.utils.formatUnits(price, 18));
    })()
  }, []);

  return (
    <div className={style.wrapperContainer} style={{ backgroundImage: `url(${background.src})`}}>
        <div className={style.wrapper}>
            <div className="flex-between flex flex-col md:flex-row items-center relative z-10">
                <h2 className={style.title}><span className="textGradPink">Featured</span> Collection</h2>
            </div>
            <div className="relative">
              <div ref={sliderRef} className="keen-slider">
                <div className="keen-slider__slide"><img  className={style.image} src={panda1.src}/></div>
                <div className="keen-slider__slide"><img  className={style.image} src={panda2.src}/></div>
                <div className="keen-slider__slide"><img  className={style.image} src={panda3.src}/></div>
                <div className="keen-slider__slide"><img  className={style.image} src={panda4.src}/></div>
                <div className="keen-slider__slide"><img  className={style.image} src={panda5.src}/></div>
                <div className="keen-slider__slide"><img  className={style.image} src={panda6.src}/></div>
                </div>
                <div ref={sliderRef_} className="keen-slider mt-2">
                <div className="keen-slider__slide"><img  className={style.image} src={panda7.src}/></div>
                <div className="keen-slider__slide"><img  className={style.image} src={panda8.src}/></div>
                <div className="keen-slider__slide"><img  className={style.image} src={panda9.src}/></div>
                <div className="keen-slider__slide"><img  className={style.image} src={panda10.src}/></div>
                <div className="keen-slider__slide"><img  className={style.image} src={panda11.src}/></div>
                <div className="keen-slider__slide"><img  className={style.image} src={panda12.src}/></div>
              </div>
              <div className="absolute top-0 left-0 text-slate-900 p-2 w-full md:w-fit" style={{ left: '50%', top: '50%', transform: "translate(-50%, -50%)"}}>
                <div className="flex gap-4 justify-center items-center py-8 md:px-8 bg-white/60 backdrop-blur-xl rounded-xl">
                  <div className="">
                    <div className="flex gap-4 justify-center text-left text-2xl relative">
                      <div className="wil-avatar relative inline-flex h-[40px] bg-white w-[40px] flex-shrink-0 items-center justify-center rounded-full text-2xl font-semibold uppercase text-neutral-100 shadow-inner ring-2 ring-neutral-400">
                        <img className="absolute inset-0 h-full w-full rounded-full object-cover" src="https://ipfs.io/ipfs/QmW9so3RSqMZPaHQwLwbX2XeUj3pyvUeJgPQLs3hYANoxK/0" alt="Pandagram v2"/>
                          <span className="wil-avatar__name">J</span>
                      </div>
                    Pandagram v2</div>
                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 my-2 mt-4 text-left border p-3 px-6 rounded-xl border-neutral-100/20">
                      <div className="text-center">Mint Price<br/> {mintPrice ? <div className="flex items-center justify-center gap-2"><span className="font-bold text-xl">{mintPrice}</span> <IconBNB/></div> :  <IconLoading dark="inbutotn" />}</div>
                      <div className="text-center">Total Supply<br/> <span className="font-bold text-xl">15000</span></div>
                      <div className="text-center">Remaining<br/> {totalUnclaimedSupply ? <span className="font-bold text-xl">{totalUnclaimedSupply.toString()}</span> : <IconLoading dark="inbutton" />}</div>
                    </div>
                    <div className="gradBlue text-neutral-100 relative w-fit py-4 px-8 m-auto mt-3 rounded-full">
                      <Link href="/collection/binance/0xbDd60f4d2795f145C09dd4eA6d9565B185F6CBF9" passhref>
                        <a>
                          View Collection
                        </a>
                      </Link>

                    </div>

                  </div>

                </div>
              </div>
            </div>
            {/* <OwlCarousel items={5}  
              className="owl-theme"  
              loop  
              nav
              autoplay  
              margin={8} >  
              <div><img  className="img" src={panda1.src}/></div>   
              <div><img  className="img" src={panda2.src}/></div>   
              <div><img  className="img" src={panda3.src}/></div>   
              <div><img  className="img" src={panda4.src}/></div>   
              <div><img  className="img" src={panda5.src}/></div>   
              <div><img  className="img" src={panda6.src}/></div>   
          </OwlCarousel>   */}
        </div>
    </div>
  )
}

export default FeaturedCollection