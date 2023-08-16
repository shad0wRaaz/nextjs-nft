import React from 'react'
import Link from 'next/link'
import bearground from '../assets/images/bearground.webp'

const Community = ({setShowMenu }) => {
  return (
    <section 
      onClick={() => setShowMenu(false)} className="community font-oregano text-3xl py-[70px] md:py-[100px]" style={{backgroundImage: `url(${bearground.src})`, backgroundSize: 'cover'}}>
        <div className="container mx-auto p-8">
            <div className="comminity__wrapper">
                <div className="community__content text-center aos-init aos-animate" data-aos="zoom-in" data-aos-duration="1000">
                    <h2 className="text--3d-mk leading-normal mb-5 ">Join The<br/>
                      <p className="mushroom-kingdom-gradient font-hennypenny text-[5rem]">Furry Grace </p>
                    </h2>
                    <p className="mb-8">Join a growing community of Nuva NFT!</p>
                    <Link href="https://discord.gg/ExyYbCUaX4" passHref>
                      <a className="default-btn" target="_blank"><span>Join Our Discord</span></a>
                    </Link>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Community