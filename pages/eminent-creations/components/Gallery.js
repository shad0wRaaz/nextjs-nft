import React from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import creature1  from '../assets/cryptocreatures/creature01.jpeg'
import creature2  from '../assets/cryptocreatures/creature02.jpeg'
import creature3  from '../assets/cryptocreatures/creature03.jpeg'
import creature4  from '../assets/cryptocreatures/creature04.jpeg'
import creature5  from '../assets/cryptocreatures/creature05.jpeg'
import creature6  from '../assets/cryptocreatures/creature06.jpeg'
import creature7  from '../assets/cryptocreatures/creature07.jpeg'
import creature8  from '../assets/cryptocreatures/creature08.jpeg'
import creature9  from '../assets/cryptocreatures/creature09.webp'
import creature10  from '../assets/cryptocreatures/creature10.webp'
import creature11  from '../assets/cryptocreatures/creature11.jpeg'
import creature12  from '../assets/cryptocreatures/creature12.jpeg'
import creature13  from '../assets/cryptocreatures/creature13.jpeg'
import creature14  from '../assets/cryptocreatures/creature14.jpeg'
import creature15  from '../assets/cryptocreatures/creature15.jpeg'
import creature16  from '../assets/cryptocreatures/creature16.jpeg'
import neon1  from '../assets/neondreams/neon1.jpeg'
import neon2  from '../assets/neondreams/neon2.jpeg'
import neon3  from '../assets/neondreams/neon3.jpeg'
import neon4  from '../assets/neondreams/neon4.jpeg'
import Image from 'next/image';
import celestial1  from '../assets/celestialbeings/celestial1.jpeg'
import celestial2  from '../assets/celestialbeings/celestial2.jpeg'
import celestial3  from '../assets/celestialbeings/celestial3.jpeg'
import celestial4  from '../assets/celestialbeings/celestial4.jpeg'
import artifacts1  from '../assets/artifacts/artifacts1.jpeg'
import artifacts2  from '../assets/artifacts/artifacts2.jpeg'
import artifacts3  from '../assets/artifacts/artifacts3.jpeg'
import artifacts4  from '../assets/artifacts/artifacts4.jpeg'
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
        className="collection alfaslab ad-basecolor py-[70px] md:py-[100px]" id="collection">
	    <div className="container mx-auto p-8">
            <div className="section-header aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000">
                <div className="section-header__content flex justify-center flex-col text-center max-w-lg m-auto">
                    <h2 className="text-4xl md:text-[4.5rem]">
                        <span className="color--gradient-ad">Our NFT Collections</span>
                    </h2>
                    <p className="m-auto text-[1.125rem]">A total of 40,000 distinct NFTs are aiming to integrate with the Norites on the Avalanche Blockchain.</p>
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
                                <Image src={neon1}  alt="Crypto Creature"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={neon2}  alt="Crypto Creature"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={neon3}  alt="Crypto Creature"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={neon4}  alt="Crypto Creature"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={neon1}  alt="Crypto Creature"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={neon2}  alt="Crypto Creature"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={neon3}  alt="Crypto Creature"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={neon4}  alt="Crypto Creature"/>
                            </div>
                        </Slider>
                    </div>
                    <div className="">
                        <Slider {...settings}>
                                <div className="swiper-slide swiper-slide-duplicate rounded-md p-3" data-swiper-slide-index="0">
                                    <Image src={celestial1}  alt="Crypto Creature"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={celestial2}  alt="Crypto Creature"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={celestial3}  alt="Crypto Creature"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={celestial4}  alt="Crypto Creature"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={celestial1}  alt="Crypto Creature"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={celestial2}  alt="Crypto Creature"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={celestial3}  alt="Crypto Creature"/>
                                </div>
                                <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                    <Image src={celestial4}  alt="Crypto Creature"/>
                                </div>
                                {/* <div className="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="0">
                                    <Image src={creature1}  alt="Crypto Creature"/>
                                </div> */}
                                
                        </Slider>
                    </div>
                    <div className="-mt-2">
                        <Slider {...settings2}>
                            <div className="swiper-slide swiper-slide-duplicate rounded-md p-3" data-swiper-slide-index="0">
                                <Image src={artifacts1}  alt="Crypto Creature"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={artifacts2}  alt="Crypto Creature"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={artifacts3}  alt="Crypto Creature"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={artifacts4}  alt="Crypto Creature"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={artifacts1}  alt="Crypto Creature"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={artifacts2}  alt="Crypto Creature"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={artifacts3}  alt="Crypto Creature"/>
                            </div>
                            <div className="swiper-slide swiper-slide-duplicate p-3" data-swiper-slide-index="0">
                                <Image src={artifacts4}  alt="Crypto Creature"/>
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