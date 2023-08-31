import React from 'react'
import Image from 'next/image';

import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import creature1  from '../assets/ursine/ursine1.webp'
import creature2  from '../assets/ursine/ursine2.webp'
import creature3  from '../assets/ursine/ursine3.webp'
import creature4  from '../assets/ursine/ursine4.webp'
import creature5  from '../assets/ursine/ursine5.webp'
import creature6  from '../assets/ursine/ursine6.webp'
import creature7  from '../assets/ursine/ursine7.webp'
import creature8  from '../assets/ursine/ursine8.webp'

import neon1  from '../assets/vulpine/vulpine1.webp'
import neon2  from '../assets/vulpine/vulpine2.webp'
import neon3  from '../assets/vulpine/vulpine3.webp'
import neon4  from '../assets/vulpine/vulpine4.webp'
import neon5  from '../assets/vulpine/vulpine5.webp'
import neon6  from '../assets/vulpine/vulpine6.webp'
import neon7  from '../assets/vulpine/vulpine7.webp'
import neon8  from '../assets/vulpine/vulpine8.webp'


import celestial1  from '../assets/lapine/lapine1.webp'
import celestial2  from '../assets/lapine/lapine2.webp'
import celestial3  from '../assets/lapine/lapine3.webp'
import celestial4  from '../assets/lapine/lapine4.webp'
import celestial5  from '../assets/lapine/lapine5.webp'
import celestial6  from '../assets/lapine/lapine6.webp'
import celestial7  from '../assets/lapine/lapine7.webp'
import celestial8  from '../assets/lapine/lapine8.webp'


import artifacts1  from '../assets/canine/canine1.webp'
import artifacts2  from '../assets/canine/canine2.webp'
import artifacts3  from '../assets/canine/canine3.webp'
import artifacts4  from '../assets/canine/canine4.webp'
import artifacts5  from '../assets/canine/canine5.webp'
import artifacts6  from '../assets/canine/canine6.webp'
import artifacts7  from '../assets/canine/canine7.webp'
import artifacts8  from '../assets/canine/canine8.webp'

import Link from 'next/link';

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
                <div className="section-header__content flex justify-center flex-col text-center m-auto">
                    <h2 className="text-4xl md:text-[4.5rem]">
                        <span className="font-hennypenny mushroom-kingdom-gradient">Our NFT Collections</span>
                    </h2>
                    <p className="m-auto text-3xl font-oregano">
                        The "Furry Grace" NFT Collection is a heartwarming and enchanting digital art series that captures the essence of unity, diversity, and coexistence among a charming ensemble of animals. Each NFT within this collection is a window into a world where different species come together in harmony, celebrating their unique qualities and forging connections that transcend boundaries.
                        <br/>
                        <br/>
                        "Furry Grace" NFTs are not just ordinary digital artworks; they're glimpses into a realm where animals of various kinds — Bears(Ursine), Foxes(Vulpine), and Rabbits(Lapine), and Dogs(Canine)—convey a message of empathy, kindness, and the shared beauty of nature. Each NFT is a testament to the delicate balance that exists within ecosystems, highlighting the importance of preserving the interconnectedness of all living beings.
                    </p>
                </div>
            </div>
		    <div className="collection__wrapper mt-10 hidden md:block">
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