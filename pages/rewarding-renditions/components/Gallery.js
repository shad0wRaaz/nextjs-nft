import React from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import creature1  from '../assets/cryptocreatures/1.png'
import creature2  from '../assets/cryptocreatures/2.png'
import creature3  from '../assets/cryptocreatures/3.png'
import creature4  from '../assets/cryptocreatures/4.png'
import creature5  from '../assets/cryptocreatures/5.png'
import creature6  from '../assets/cryptocreatures/6.png'
import creature7  from '../assets/cryptocreatures/7.png'
import creature8  from '../assets/cryptocreatures/8.png'

import neon1  from '../assets/neondreams/1.png'
import neon2  from '../assets/neondreams/2.png'
import neon3  from '../assets/neondreams/3.png'
import neon4  from '../assets/neondreams/4.png'
import neon5  from '../assets/neondreams/5.png'
import neon6  from '../assets/neondreams/6.png'
import neon7  from '../assets/neondreams/7.png'
import neon8  from '../assets/neondreams/8.png'


import Image from 'next/image';
import celestial1  from '../assets/celestialbeings/1.png'
import celestial2  from '../assets/celestialbeings/2.png'
import celestial3  from '../assets/celestialbeings/3.png'
import celestial4  from '../assets/celestialbeings/4.png'
import celestial5  from '../assets/celestialbeings/5.png'
import celestial6  from '../assets/celestialbeings/6.png'
import celestial7  from '../assets/celestialbeings/7.png'
import celestial8  from '../assets/celestialbeings/8.png'


import artifacts1  from '../assets/artifacts/1.png'
import artifacts2  from '../assets/artifacts/2.png'
import artifacts3  from '../assets/artifacts/3.png'
import artifacts4  from '../assets/artifacts/4.png'
import artifacts5  from '../assets/artifacts/5.png'
import artifacts6  from '../assets/artifacts/6.png'
import artifacts7  from '../assets/artifacts/7.png'
import artifacts8  from '../assets/artifacts/8.png'

import Link from 'next/link';

const Gallery = ({ setShowMenu }) => {
    const HOST = process.env.NODE_ENV == 'production' ?  'https://nuvanft.io' : 'http://localhost:3000'
    const settings = {
        dots: false,
        infinite: true,
        fade: false,
        speed: 1000,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: false,
        arrows: false,
      };
    const settings2 = {
        dots: false,
        infinite: true,
        fade: false,
        speed: 1000,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3127,
        pauseOnHover: false,
        arrows: false,
      };
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
                        <Slider {...settings}>
                                <div className="swiper-slide swiper-slide-duplicate rounded-md p-3" data-swiper-slide-index="0">
                                    <Image src={creature1}  alt="Crypto Creature"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={creature2}  alt="Crypto Creature"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={creature3}  alt="Crypto Creature"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={creature4}  alt="Crypto Creature"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={creature5}  alt="Crypto Creature"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={creature6}  alt="Crypto Creature"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={creature7}  alt="Crypto Creature"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={creature8}  alt="Crypto Creature"/>
                                </div>
                                {/* <div className="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="0">
                                    <Image src={creature1}  alt="Crypto Creature"/>
                                </div> */}
                                
                        </Slider>
                    </div>
                    <div className="-mt-2">
                        <Slider {...settings2}>
                            <div className="swiper-slide swiper-slide-duplicate rounded-md p-3" data-swiper-slide-index="0">
                                <Image src={neon1}  alt="Neon Dreams"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={neon2}  alt="Neon Dreams"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={neon3}  alt="Neon Dreams"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={neon4}  alt="Neon Dreams"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={neon5}  alt="Neon Dreams"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={neon6}  alt="Neon Dreams"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={neon7}  alt="Neon Dreams"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={neon8}  alt="Neon Dreams"/>
                            </div>
                        </Slider>
                    </div>
                    <div className="">
                        <Slider {...settings}>
                                <div className="swiper-slide swiper-slide-duplicate rounded-md p-3" data-swiper-slide-index="0">
                                    <Image src={celestial1}  alt="Celestial Beings"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={celestial2}  alt="Celestial Beings"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={celestial3}  alt="Celestial Beings"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={celestial4}  alt="Celestial Beings"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={celestial5}  alt="Celestial Beings"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={celestial6}  alt="Celestial Beings"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={celestial7}  alt="Celestial Beings"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={celestial8}  alt="Celestial Beings"/>
                                </div>
                                {/* <div className="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="0">
                                    <Image src={creature1}  alt="Crypto Creature"/>
                                </div> */}
                                
                        </Slider>
                    </div>
                    <div className="-mt-2">
                        <Slider {...settings2}>
                            <div className="swiper-slide swiper-slide-duplicate rounded-md p-3" data-swiper-slide-index="0">
                                <Image src={artifacts1}  alt="Artifacts of the Future"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={artifacts2}  alt="Artifacts of the Future"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={artifacts3}  alt="Artifacts of the Future"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={artifacts4}  alt="Artifacts of the Future"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={artifacts5}  alt="Artifacts of the Future"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={artifacts6}  alt="Artifacts of the Future"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={artifacts7}  alt="Artifacts of the Future"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={artifacts8}  alt="Artifacts of the Future"/>
                            </div>
                        </Slider>
                    </div>
				    {/* <div className="swiper collection__thumb-slider-1 mb-3">
					<div className="swiper swiper-initialized swiper-horizontal swiper-pointer-events">
						<div className="swiper-wrapper">
						</div>
                        </div>
                    </div>
                    <div className="swiper collection__thumb-slider-2">
                        <div className="swiper swiper-initialized swiper-horizontal swiper-pointer-events">
                            <div className="swiper-wrapper">
                                <div className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-next" data-swiper-slide-index="0">
                                    <div className="collection__thumb-item">
                                        <img src="http://bored.labartisan.net/assets/images/collection/07.jpg" alt="Crypto Creature" />
                                    </div>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="1">
                                    <div className="collection__thumb-item">
                                        <img src="http://bored.labartisan.net/assets/images/collection/08.jpg" alt="Crypto Creature" />
                                    </div>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="2">
                                    <div className="collection__thumb-item">
                                        <img src="http://bored.labartisan.net/assets/images/collection/09.jpg" alt="Crypto Creature" />
                                    </div>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="3">
                                    <div className="collection__thumb-item">
                                        <img src="http://bored.labartisan.net/assets/images/collection/10.jpg" alt="Crypto Creature" />
                                    </div>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate swiper-slide-prev" data-swiper-slide-index="4">
                                    <div className="collection__thumb-item">
                                        <img src="http://bored.labartisan.net/assets/images/collection/11.jpg" alt="Crypto Creature" />
                                    </div>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate swiper-slide-active" data-swiper-slide-index="5">
                                    <div className="collection__thumb-item">
                                        <img src="http://bored.labartisan.net/assets/images/collection/12.jpg" alt="Crypto Creature" />
                                    </div>
                                </div>
                                <div className="swiper-slide swiper-slide-next" data-swiper-slide-index="0">
                                    <div className="collection__thumb-item">
                                        <img src="http://bored.labartisan.net/assets/images/collection/07.jpg" alt="Crypto Creature" />
                                    </div>
                                </div>
                                <div className="swiper-slide" data-swiper-slide-index="1">
                                    <div className="collection__thumb-item">
                                        <img src="http://bored.labartisan.net/assets/images/collection/08.jpg" alt="Crypto Creature" />
                                    </div>
                                </div>
                                <div className="swiper-slide" data-swiper-slide-index="2">
                                    <div className="collection__thumb-item">
                                        <img src="http://bored.labartisan.net/assets/images/collection/09.jpg" alt="Crypto Creature" />
                                    </div>
                                </div>
                                <div className="swiper-slide" data-swiper-slide-index="3">
                                    <div className="collection__thumb-item">
                                        <img src="http://bored.labartisan.net/assets/images/collection/10.jpg" alt="Crypto Creature" />
                                    </div>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate-prev" data-swiper-slide-index="4">
                                    <div className="collection__thumb-item">
                                        <img src="http://bored.labartisan.net/assets/images/collection/11.jpg" alt="Crypto Creature" />
                                    </div>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate-active" data-swiper-slide-index="5">
                                    <div className="collection__thumb-item">
                                        <img src="http://bored.labartisan.net/assets/images/collection/12.jpg" alt="Crypto Creature" />
                                    </div>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-next" data-swiper-slide-index="0">
                                    <div className="collection__thumb-item">
                                        <img src="http://bored.labartisan.net/assets/images/collection/07.jpg" alt="Crypto Creature" />
                                    </div>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="1">
                                    <div className="collection__thumb-item">
                                        <img src="http://bored.labartisan.net/assets/images/collection/08.jpg" alt="Crypto Creature" />
                                    </div>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="2">
                                    <div className="collection__thumb-item">
                                        <img src="http://bored.labartisan.net/assets/images/collection/09.jpg" alt="Crypto Creature" />
                                    </div>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="3">
                                    <div className="collection__thumb-item">
                                        <img src="http://bored.labartisan.net/assets/images/collection/10.jpg" alt="Crypto Creature" />
                                    </div>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="4">
                                    <div className="collection__thumb-item">
                                        <img src="http://bored.labartisan.net/assets/images/collection/11.jpg" alt="Crypto Creature" />
                                    </div>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="5">
                                    <div className="collection__thumb-item">
                                        <img src="http://bored.labartisan.net/assets/images/collection/12.jpg" alt="Crypto Creature" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    {/* <div className="text-center mt-[3rem]">
                        <Link href={`${HOST}/collection/binance-testnet/0x2D7ec9C0e08fE4440472c04a03F1Ff85833DE923`} passHref>
                            <a className="default-btn">View On Nuva NFT</a>
                        </Link>
                    </div> */}
                </div>
            </div>
        </div>
    </section>
  )
}

export default Gallery