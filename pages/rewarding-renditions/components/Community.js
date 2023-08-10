import Link from 'next/link'
import React from 'react'
import bannerbg from '../assets/images/banner-bg.webp'

const Community = ({setShowMenu }) => {
  return (
    <section 
      onClick={() => setShowMenu(false)} className="community alfaslab py-[70px] md:py-[100px]" style={{backgroundImage: `url(${bannerbg.src})`}}>
        <div className="container mx-auto p-8">
            <div className="comminity__wrapper">
                <div className="community__content text-center aos-init aos-animate" data-aos="zoom-in" data-aos-duration="1000">
                    <h2 className="text--3d leading-normal mb-5 !text-5xl !md:text-7xl"><span className="color--gradient-y d-block">Join The </span><br/> Rewarding Renditions</h2>
                    <p className="text-xl mb-8">Join a growing community of Renderers!</p>
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