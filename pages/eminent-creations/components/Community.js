import Link from 'next/link'
import React from 'react'
import bannerbg from '../assets/images/banner-bg-ec.jpeg'

const Community = ({setShowMenu }) => {
  return (
    <section 
      onClick={() => setShowMenu(false)} className="community alfaslab py-[70px] md:py-[100px]" style={{backgroundImage: `url(${bannerbg.src})`, backgroundSize: 'cover'}}>
        <div className="container mx-auto p-8">
            <div className="comminity__wrapper">
                <div className="community__content text-center aos-init aos-animate" data-aos="zoom-in" data-aos-duration="1000">
                    <h2 className="text--3d leading-normal mb-5 !text-5xl !md:text-7xl">Join The <br/> <span className="color--gradient-ec d-block">Eminent Creations</span></h2>
                    <p className="text-xl mb-8">Join a growing community of Admirers!</p>
                    <Link href="https://discord.gg/kgm7s3hn">
                      <a className="default-btn"><span>Join Our Discord</span></a>
                    </Link>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Community