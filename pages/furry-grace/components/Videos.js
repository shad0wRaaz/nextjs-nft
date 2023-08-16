import React from 'react'
import bannerbg from '../assets/images/bearground.webp'
import thumb1 from '../assets/images/thumb1.jpeg'
import thumb2 from '../assets/images/thumb2.jpeg'
import thumb3 from '../assets/images/thumb3.jpeg'
import Link from 'next/link'
import Image from 'next/image'

const Videos = ({ setShowMenu }) => {
  return (
    <section id="videos" 
      onClick={() => setShowMenu(false)} className="community font-oregano text-3xl py-[70px] md:py-[100px]" style={{backgroundImage: `url(${bannerbg.src})`, backgroundSize: 'cover'}}>
        <div className="container mx-auto p-8">
            <div className="comminity__wrapper">
                <div className="community__content text-center aos-init aos-animate" data-aos="zoom-in" data-aos-duration="1000">
                    <h2 className="text--3d-mk leading-normal mb-5 !text-5xl !md:text-7xl">
                        <span className="mushroom-kingdom-gradient font-hennypenny">Tutorial Videos </span>
                    </h2>
                    <p className="mb-8 text-slate-900">Some informative/guiding videos that might be of great help.</p>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                        <div>
                            <Link href="https://www.youtube.com/watch?v=Ak6GIV5cDFE" passHref>
                                <a target="_blank">
                                    <Image src={thumb1.src} className="rounded-xl cursor-pointer overflow-hidden" height="315px" width="370px" objectFit="cover" alt="Video Thumbnail"/>
                                </a>
                            </Link>
                                {/* <iframe className="w-full h-[315px]" src="https://www.youtube.com/embed/Ak6GIV5cDFE" title="YouTube video player" allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe> */}
                            <p className="my-4">How to register with NuvaNFT, simply by connecting your DeFi wallet address</p>
                        </div>
                        <div>
                            <Link href="https://www.youtube.com/watch?v=IF5-5G8x95QE" passHref>
                                <a target="_blank">
                                    <Image src={thumb2.src} className="rounded-xl cursor-pointer overflow-hidden" height="315px" width="370px" objectFit="cover" alt="Video Thumbnail"/>
                                </a>
                            </Link>
                                {/* <iframe className="w-full h-[315px]" src="https://www.youtube.com/embed/u7anL0MyEck" title="YouTube video player" allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ></iframe> */}
                            <p className="my-4">How to create Metamask Wallet?</p>
                        </div>
                        {/* <div>
                            <Link href="https://www.youtube.com/watch?v=gQsfhH3DCDc" passHref>
                                <a target="_blank">
                                    <Image src={thumb3.src} className="rounded-xl cursor-pointer overflow-hidden" height="315px" width="370px" objectFit="cover" alt="Video Thumbnail"/>
                                </a>
                            </Link>
                            <p className="my-4">Nuva NFT Rewarding Rendition Whitepaper</p>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Videos