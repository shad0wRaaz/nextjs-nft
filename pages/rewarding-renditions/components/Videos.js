import React from 'react'
import bannerbg from '../assets/images/banner-bg.png'
import Link from 'next/link'

const Videos = () => {
  return (
    <section id="videos" 
      onClick={() => setShowMenu(false)} className="community alfaslab py-[70px] md:py-[100px]" style={{backgroundImage: `url(${bannerbg.src})`}}>
        <div className="container mx-auto p-8">
            <div className="comminity__wrapper">
                <div className="community__content text-center aos-init aos-animate" data-aos="zoom-in" data-aos-duration="1000">
                    <h2 className="text--3d leading-normal mb-5 !text-5xl !md:text-7xl"><span className="color--gradient-y d-block">Tutorial Videos </span></h2>
                    <p className="text-xl mb-8">Some informative/guiding videos that might be of great help.</p>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <div className="rounded-xl overflow-hidden">
                                <iframe className="w-full h-[315px]" src="https://www.youtube.com/embed/Ak6GIV5cDFE" title="YouTube video player" allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
                            </div>
                            <p className="my-4">How to register with NuvaNFT, simply by connecting your DeFi wallet address</p>
                        </div>
                        <div>
                            <div className="rounded-xl overflow-hidden">
                                <iframe className="w-full h-[315px]" src="https://www.youtube.com/embed/u7anL0MyEck" title="YouTube video player" allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ></iframe>
                            </div>
                            <p className="my-4">How to create Metamask Wallet?</p>
                        </div>
                        <div>
                            <div className="rounded-xl overflow-hidden">
                                <iframe className="w-full h-[315px]" src="https://www.youtube.com/embed/gQsfhH3DCDc" title="YouTube video player" allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ></iframe>
                            </div>
                            <p className="my-4">Nuva NFT Rewarding Rendition Whitepaper</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Videos