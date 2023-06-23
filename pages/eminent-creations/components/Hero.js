import React from 'react'
import "@fontsource/alfa-slab-one";
import bannerbg from '../assets/images/banner-bg-ec.webp'
import discord from '../assets/images/discord.png'
import twitter from '../assets/images/twitter.png'
import facebook from '../assets/images/facebook.png'
import instagram from '../assets/images/instagram.png'
import youtube from '../assets/images/youtube.png'
import madmonkey1 from '../assets/images/madmonkey1.png'
import madmonkey2 from '../assets/images/madmonkey2.png'
import madmonkey3 from '../assets/images/madmonkey3.png'
import madmonkey4 from '../assets/images/madmonkey4.png'

import Link from 'next/link';
import { IconAvalanche, IconBNB, IconEthereum } from '../../../components/icons/CustomIcons';
import OtherReferralCommissions from '../../../components/referralCommissions/OtherReferralCommissions';

const Hero = ({setShowMenu}) => {
    const HOST = process.env.NODE_ENV == 'production' ?  'https://nuvanft.io' : 'http://localhost:3000'
  return (
    <section onClick={() => setShowMenu(false)} id="home" className="rrbanner !pb-0 !pt-[12rem] md:!pt-[150px]" style={{ fontFamily: 'Alfa Slab One' }}>
        <div className="container mx-auto px-8">
            <div className="rrbanner__wrapper">
                <div className="flex items-center justify-center gap-5">
                    <div className="col">
                        <div className="rrbanner__content text-center aos-init aos-animate" data-aos="fade-up" data-aos-duration="2000">
                            <h1 className="text--3d text-uppercase leading-[1.2]"> 
                                <span className="color--gradient-ec">Eminent<br/>Creations</span> 
                            </h1>
                            <p className="font-normal leading-[2rem] md:leading-[4rem]">First ever Referrals on NFTs<br/>40,000 Unique Digital Characters<br/>Shared Royalty for Life<br/>Shared Platform Fee<br/>Starting from 30th of June, 2023</p>
                            <ul className="social flex gap-5 justify-center mb-10">
                                <li className="social__item">
                                    <Link href="https://discord.gg/kgm7s3hn" className="social__link cursor-pointer">
                                        <a target="_blank">
                                            <img src={discord.src} className="cursor-pointer" alt="Social Thumb"/>
                                        </a>
                                    </Link>
                                </li>
                                <li className="social__item">
                                    <Link href="https://twitter.com/RewardRendition" className="social__link cursor-pointer">
                                        <a target="_blank">
                                            <img src={twitter.src} className="cursor-pointer" alt="Social Thumb "/>
                                        </a>
                                    </Link>
                                </li>
                                <li className="social__item">
                                    <Link href="https://www.facebook.com/RewardRenditions" className="social__link cursor-pointer">
                                        <a target="_blank">
                                            <img src={facebook.src} className="cursor-pointer" alt="Social Thumb " style={{ height: '60px', width: '60px'}} />
                                        </a>
                                    </Link>
                                </li>
                                <li className="social__item">
                                    <Link href="https://www.instagram.com/nuva.community/" className="social__link cursor-pointer">
                                        <a target="_blank">
                                            <img src={instagram.src} className="cursor-pointer" alt="Social Thumb"/>
                                        </a>
                                    </Link>
                                </li>
                                <li className="social__item">
                                    <Link href="https://www.youtube.com/@METANUVACOMMUNITY" className="social__link cursor-pointer">
                                        <a target="_blank">
                                            <img src={youtube.src} className="cursor-pointer" alt="Social Thumb"/>
                                        </a>
                                    </Link>
                                </li>
                            </ul>
                            {/* <Link href={`${HOST}/collection/binance-testnet/0x2D7ec9C0e08fE4440472c04a03F1Ff85833DE923`} passHref>
                                <a className="default-btn">View On Nuva NFT</a>
                            </Link> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex justify-between md:mt-[-4rem]">
            <div className="flex">
                <div className="rrbanner__apes-item">
                    <img src={madmonkey1.src} alt="Crypto Creatures Mad Monkey" className="md:h-[300px]"/>
                </div>
                <div className="rrbanner__apes-item">
                    <img src={madmonkey2.src} alt="Crypto Creatures Mad Monkey" className="md:left-[20%] md:h-[300px] relative"/>
                </div>
            </div>

            <div className="flex">
                <div className="rrbanner__apes-item">
                    <img src={madmonkey3.src} alt="Crypto Creatures Mad Monkey" className="relative md:left-[-60%] md:h-[300px]"/>
                </div>
                <div className="rrbanner__apes-item">
                    <img src={madmonkey4.src} alt="Crypto Creatures Mad Monkey" className="relative md:left-[-20%] md:h-[300px]"/>
                </div>

            </div>
        </div>
        <OtherReferralCommissions currentChain={'polygon'}/>
    </section>
  )
}

export default Hero