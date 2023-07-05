import React from 'react'
import Image from 'next/image';

import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import creature1  from '../../rewarding-renditions/assets/cryptocreatures/1.png'
import creature2  from '../../rewarding-renditions/assets/cryptocreatures/2.png'
import creature3  from '../../rewarding-renditions/assets/cryptocreatures/3.png'
import creature4  from '../../rewarding-renditions/assets/cryptocreatures/4.png'
import creature5  from '../../rewarding-renditions/assets/cryptocreatures/5.png'
import creature6  from '../../rewarding-renditions/assets/cryptocreatures/6.png'
import creature7  from '../../rewarding-renditions/assets/cryptocreatures/7.png'
import creature8  from '../../rewarding-renditions/assets/cryptocreatures/8.png'

import neon1  from '../../rewarding-renditions/assets/neondreams/1.png'
import neon2  from '../../rewarding-renditions/assets/neondreams/2.png'
import neon3  from '../../rewarding-renditions/assets/neondreams/3.png'
import neon4  from '../../rewarding-renditions/assets/neondreams/4.png'
import neon5  from '../../rewarding-renditions/assets/neondreams/5.png'
import neon6  from '../../rewarding-renditions/assets/neondreams/6.png'
import neon7  from '../../rewarding-renditions/assets/neondreams/7.png'
import neon8  from '../../rewarding-renditions/assets/neondreams/8.png'


import celestial1  from '../../rewarding-renditions/assets/celestialbeings/1.png'
import celestial2  from '../../rewarding-renditions/assets/celestialbeings/2.png'
import celestial3  from '../../rewarding-renditions/assets/celestialbeings/3.png'
import celestial4  from '../../rewarding-renditions/assets/celestialbeings/4.png'
import celestial5  from '../../rewarding-renditions/assets/celestialbeings/5.png'
import celestial6  from '../../rewarding-renditions/assets/celestialbeings/6.png'
import celestial7  from '../../rewarding-renditions/assets/celestialbeings/7.png'
import celestial8  from '../../rewarding-renditions/assets/celestialbeings/8.png'


import artifacts1  from '../../rewarding-renditions/assets/artifacts/1.png'
import artifacts2  from '../../rewarding-renditions/assets/artifacts/2.png'
import artifacts3  from '../../rewarding-renditions/assets/artifacts/3.png'
import artifacts4  from '../../rewarding-renditions/assets/artifacts/4.png'
import artifacts5  from '../../rewarding-renditions/assets/artifacts/5.png'
import artifacts6  from '../../rewarding-renditions/assets/artifacts/6.png'
import artifacts7  from '../../rewarding-renditions/assets/artifacts/7.png'
import artifacts8  from '../../rewarding-renditions/assets/artifacts/8.png'

const Gallery = ({ setShowMenu }) => {
    const HOST = process.env.NODE_ENV == 'production' ?  'https://nuvanft.io' : 'http://localhost:3000';
    const animation = { duration: 30000, easing: (t) => t }
    const [cryptoSliderRef, instanceRef_crypto] = useKeenSlider({
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
            slides: { perView: 6, spacing: 10 },
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
      const [neonSliderRef, instanceRef_neon] = useKeenSlider({
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
            slides: { perView: 6, spacing: 10 },
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
    const [celestialSliderRef, instanceRef_celestial] = useKeenSlider({
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
            slides: { perView: 6, spacing: 10 },
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
    const [artifactsSliderRef, instanceRef_artifacts] = useKeenSlider({
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
            slides: { perView: 6, spacing: 10 },
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
  return (
    <section 
        onClick={() => setShowMenu(false)}
        className="collection alfaslab py-[70px] md:py-[100px] bg-[#23162c]" id="collection">
	    <div className="container mx-auto p-8">
            <div className="section-header aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000">
                <div className="section-header__content flex justify-center flex-col text-center max-w-lg m-auto">
                    <h2 className="text-4xl md:text-[4.5rem]">
                        <span className="color--gradient-y">Our NFT Collections</span>
                    </h2>
                    <p className="m-auto text-[1.125rem]">40,000 Unique NFTs Trying to Blend With The Norites On The Binance Smart Blockchain.</p>
                </div>
            </div>
		    <div className="collection__wrapper mt-10">
			    <div className="collection__thumb">
                    <div className="">
                        <div ref={cryptoSliderRef} className="keen-slider">
                                <div className="keen-slider__slide3" data-swiper-slide-index="0">
                                    <Image src={creature1}  alt="Crypto Creature"/>
                                </div>
                                <div className="keen-slider__slide" data-swiper-slide-index="0">
                                    <Image src={creature2}  alt="Crypto Creature"/>
                                </div>
                                <div className="keen-slider__slide" data-swiper-slide-index="0">
                                    <Image src={creature3}  alt="Crypto Creature"/>
                                </div>
                                <div className="keen-slider__slide" data-swiper-slide-index="0">
                                    <Image src={creature4}  alt="Crypto Creature"/>
                                </div>
                                <div className="keen-slider__slide" data-swiper-slide-index="0">
                                    <Image src={creature5}  alt="Crypto Creature"/>
                                </div>
                                <div className="keen-slider__slide" data-swiper-slide-index="0">
                                    <Image src={creature6}  alt="Crypto Creature"/>
                                </div>
                                <div className="keen-slider__slide" data-swiper-slide-index="0">
                                    <Image src={creature7}  alt="Crypto Creature"/>
                                </div>
                                <div className="keen-slider__slide" data-swiper-slide-index="0">
                                    <Image src={creature8}  alt="Crypto Creature"/>
                                </div>
                        </div>
                    </div>
                    <div className="mt-2">
                        <div ref={neonSliderRef} className="keen-slider">
                            <div className="keen-slider__slide3" data-swiper-slide-index="0">
                                <Image src={neon1}  alt="Neon Dreams"/>
                            </div>
                            <div className="keen-slider__slide" data-swiper-slide-index="0">
                                <Image src={neon2}  alt="Neon Dreams"/>
                            </div>
                            <div className="keen-slider__slide" data-swiper-slide-index="0">
                                <Image src={neon3}  alt="Neon Dreams"/>
                            </div>
                            <div className="keen-slider__slide" data-swiper-slide-index="0">
                                <Image src={neon4}  alt="Neon Dreams"/>
                            </div>
                            <div className="keen-slider__slide" data-swiper-slide-index="0">
                                <Image src={neon5}  alt="Neon Dreams"/>
                            </div>
                            <div className="keen-slider__slide" data-swiper-slide-index="0">
                                <Image src={neon6}  alt="Neon Dreams"/>
                            </div>
                            <div className="keen-slider__slide" data-swiper-slide-index="0">
                                <Image src={neon7}  alt="Neon Dreams"/>
                            </div>
                            <div className="keen-slider__slide" data-swiper-slide-index="0">
                                <Image src={neon8}  alt="Neon Dreams"/>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2">
                        <div ref={celestialSliderRef} className="keen-slider">
                                <div className="keen-slider__slide3" data-swiper-slide-index="0">
                                    <Image src={celestial1}  alt="Celestial Beings"/>
                                </div>
                                <div className="keen-slider__slide" data-swiper-slide-index="0">
                                    <Image src={celestial2}  alt="Celestial Beings"/>
                                </div>
                                <div className="keen-slider__slide" data-swiper-slide-index="0">
                                    <Image src={celestial3}  alt="Celestial Beings"/>
                                </div>
                                <div className="keen-slider__slide" data-swiper-slide-index="0">
                                    <Image src={celestial4}  alt="Celestial Beings"/>
                                </div>
                                <div className="keen-slider__slide" data-swiper-slide-index="0">
                                    <Image src={celestial5}  alt="Celestial Beings"/>
                                </div>
                                <div className="keen-slider__slide" data-swiper-slide-index="0">
                                    <Image src={celestial6}  alt="Celestial Beings"/>
                                </div>
                                <div className="keen-slider__slide" data-swiper-slide-index="0">
                                    <Image src={celestial7}  alt="Celestial Beings"/>
                                </div>
                                <div className="keen-slider__slide" data-swiper-slide-index="0">
                                    <Image src={celestial8}  alt="Celestial Beings"/>
                                </div>
                        </div>
                    </div>
                    <div className="mt-2">
                        <div ref={artifactsSliderRef} className="keen-slider">
                            <div className="keen-slider__slide3" data-swiper-slide-index="0">
                                <Image src={artifacts1}  alt="Artifacts of the Future"/>
                            </div>
                            <div className="keen-slider__slide" data-swiper-slide-index="0">
                                <Image src={artifacts2}  alt="Artifacts of the Future"/>
                            </div>
                            <div className="keen-slider__slide" data-swiper-slide-index="0">
                                <Image src={artifacts3}  alt="Artifacts of the Future"/>
                            </div>
                            <div className="keen-slider__slide" data-swiper-slide-index="0">
                                <Image src={artifacts4}  alt="Artifacts of the Future"/>
                            </div>
                            <div className="keen-slider__slide" data-swiper-slide-index="0">
                                <Image src={artifacts5}  alt="Artifacts of the Future"/>
                            </div>
                            <div className="keen-slider__slide" data-swiper-slide-index="0">
                                <Image src={artifacts6}  alt="Artifacts of the Future"/>
                            </div>
                            <div className="keen-slider__slide" data-swiper-slide-index="0">
                                <Image src={artifacts7}  alt="Artifacts of the Future"/>
                            </div>
                            <div className="keen-slider__slide" data-swiper-slide-index="0">
                                <Image src={artifacts8}  alt="Artifacts of the Future"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Gallery