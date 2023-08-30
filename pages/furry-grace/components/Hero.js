import React from 'react'
import "@fontsource/alfa-slab-one";
import palace from '../assets/images/foxground.webp'
import discord from '../assets/images/discord.png'
import twitter from '../assets/images/twitter.png'
import facebook from '../assets/images/facebook.png'
import instagram from '../assets/images/instagram.png'
import tiktok from '../assets/images/tiktok.png'
import youtube from '../assets/images/youtube.png'
import madmonkey1 from '../assets/images/nomin1.png'
import madmonkey2 from '../assets/images/grutzi1.png'
import madmonkey3 from '../assets/images/hidoi1.png'
import madmonkey4 from '../assets/images/kaioji1.png'

import Link from 'next/link';
import OtherReferralCommissions from '../../../components/referralCommissions/OtherReferralCommissions';

const Hero = ({setShowMenu}) => {
    const HOST = process.env.NODE_ENV == 'production' ?  'https://nuvanft.io' : 'http://localhost:3000'
  return (
    <section onClick={() => setShowMenu(false)} id="home" className="rrbanner !pb-0 !pt-[12rem] md:!pt-[150px]" style={{ fontFamily: 'Alfa Slab One', backgroundImage: `url('${palace.src}')`}}>
        <div className="container mx-auto px-8 relative z-10 pb-[8rem]">
            <div className="rrbanner__wrapper">
                <div className="flex items-center justify-center gap-5">
                    <div className="col">
                        <div className=" mkbanner__content text-center aos-init aos-animate" data-aos="fade-up" data-aos-duration="2000">
                            <h1 className="text--3d text-xl leading-[1.2] -skew-y-6 "> 
                                <span className="mushroom-kingdom-gradient font-hennypenny">Furry<br/>Grace</span> 
                            </h1>
                            <p className="text-2xl mb-8 md:text-[3rem] leading-[2rem] md:leading-[4rem] mushroom-kingdom-gradient -skew-y-6 text--3d-mk font-oregano">First ever Referrals on NFTs<br/>40,000 Unique Digital Characters<br/>Get Loyalty Rewards from upto 5 levels<br/>Get 5% Royalty on every resale forever<br/>Get 0.25% of Platform Fee as Reward<br/>Starting from 20th of September, 2023</p>
                            <ul className="social flex gap-5 justify-center mb-10 -skew-y-6 ">
                                <li className="social__item transition hover:-translate-x-1 hover:-translate-y-1 ">
                                    <Link href="https://discord.gg/ExyYbCUaX4" className="social__link cursor-pointer">
                                        <a target="_blank">
                                            <img src={discord.src} className="cursor-pointer" alt="Social Thumb"/>
                                        </a>
                                    </Link>
                                </li>
                                <li className="social__item transition hover:-translate-x-1 hover:-translate-y-1">
                                    <Link href="https://twitter.com/RewardRendition" className="social__link cursor-pointer">
                                        <a target="_blank">
                                            <img src={twitter.src} className="cursor-pointer" alt="Social Thumb "/>
                                        </a>
                                    </Link>
                                </li>
                                <li className="social__item transition hover:-translate-x-1 hover:-translate-y-1">
                                    <Link href="https://www.facebook.com/RewardRenditions" className="social__link cursor-pointer">
                                        <a target="_blank">
                                            <img src={facebook.src} className="cursor-pointer" alt="Social Thumb "/>
                                        </a>
                                    </Link>
                                </li>
                                <li className="social__item transition hover:-translate-x-1 hover:-translate-y-1">
                                    <Link href="https://www.instagram.com/nuva.community/" className="social__link cursor-pointer">
                                        <a target="_blank">
                                            <img src={instagram.src} className="cursor-pointer" alt="Social Thumb"/>
                                        </a>
                                    </Link>
                                </li>
                                <li className="social__item transition hover:-translate-x-1 hover:-translate-y-1">
                                    <Link href="https://www.youtube.com/@METANUVACOMMUNITY" className="social__link cursor-pointer">
                                        <a target="_blank">
                                            <img src={youtube.src} className="cursor-pointer" alt="Social Thumb"/>
                                        </a>
                                    </Link>
                                </li>
                                <li className="social__item transition hover:-translate-x-1 hover:-translate-y-1">
                                    <Link href="https://www.tiktok.com/@nuvacommunity" className="social__link cursor-pointer">
                                        <a target="_blank">
                                            <img src={tiktok.src} className="cursor-pointer" alt="Social Thumb"/>
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
        {/* <div className="flex justify-between md:mt-[-4rem]">
            <div className="flex">
                <div className="rrbanner__apes-item">
                    <img src={madmonkey1.src} alt="Nomin" className="md:h-[300px]"/>
                </div>
                <div className="rrbanner__apes-item">
                    <img src={madmonkey2.src} alt="Grutzi" className="md:left-[20%] md:bottom[-10%] md:h-[300px] relative"/>
                </div>
            </div>

            <div className="flex">
                <div className="rrbanner__apes-item">
                    <img src={madmonkey3.src} alt="Hidoi" className="relative md:left-[-20%] md:h-[300px]"/>
                </div>
                <div className="rrbanner__apes-item">
                    <img src={madmonkey4.src} alt="Kaioji" className="relative md:left-[-20%] md:h-[300px]"/>
                </div>

            </div>
        </div> */}
        <OtherReferralCommissions collectionName={'furry-grace'}/>
    </section>
  )
}

export default Hero