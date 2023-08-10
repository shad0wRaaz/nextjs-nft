import Link from 'next/link'
import React from 'react'
import bannerbg from '../assets/images/banner-bg.webp'
import hidoiplace from '../assets/images/hidoiplace.webp'

const Community = ({setShowMenu }) => {
  return (
    <section 
      onClick={() => setShowMenu(false)} className="community font-oregano text-3xl py-[70px] md:py-[100px]" style={{backgroundImage: `url(${hidoiplace.src})`, backgroundSize: 'cover'}}>
        <div className="container mx-auto p-8">
            <div className="comminity__wrapper">
                <div className="community__content text-center aos-init aos-animate" data-aos="zoom-in" data-aos-duration="1000">
                    <h2 className="text--3d-mk leading-normal mb-5 ">Join The<br/>
                      <p className="mushroom-kingdom-gradient font-hennypenny text-[5rem]">Mushroom Kingdom </p>
                    </h2>
                    <p className="mb-8">Join a growing community of Nuva NFT!</p>
                    <Link href="https://discord.gg/SrdCjEQz" passHref>
                      <a className="default-btn" target="_blank"><span>Join Our Discord</span></a>
                    </Link>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Community