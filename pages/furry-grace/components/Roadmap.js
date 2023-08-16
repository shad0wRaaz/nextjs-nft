import React from 'react'
import { BsBoxSeam, BsRocketTakeoff } from 'react-icons/bs'
import { BiNetworkChart } from 'react-icons/bi'
import { TbMoneybag, TbPigMoney, TbParachute } from 'react-icons/tb'

const Roadmap = ({ setShowMenu }) => {
  return (
    <section 
        onClick={() => setShowMenu(false)}
        className="roadmap padding-top padding-bottom font-oregano text-[1.55rem] pb-[70px] md:pb-[100px] bg-[#23162c]" id="roadmap">
        <div className="container mx-auto p-8 pt-0">
            <div className="section-header aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000">
                <div className="section-header__content text-center w-full max-w-[1000px] mx-auto">
                    <h2 className=" text-4xl md:text-[4.5rem] leading-normal"> 
                        <span className="mushroom-kingdom-gradient font-hennypenny"> Furry Grace <br/>Roadmap</span></h2>
                    <p className="font-oregano text-3xl">This is our roadmap so far, but this is only the beginning we want to build our project around our community, so if you have more ideas we are all ears.</p>
                </div>
            </div>
            <div className="roadmap__wrapper mt-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="col-lg-4 col-md-6">
                    <div className="roadmap__item aos-init" data-aos="fade-left" data-aos-duration="1000">
                        <div className="roadmap__inner">
                            <div className="roadmap__thumb">
                                <BsRocketTakeoff fontSize={50} color='#000' className="mb-5"/>
                                {/* <img src="http://bored.labartisan.net/assets/images/roadmap/01.png" alt="Roadmap Icon" /> */}
                            </div>
                            <div className="roadmap__content">
                                <h4 className="font-hennypenny font-bold">Launch</h4>
                                <p>5,000 NFTs in Ursine and Vulpine, 10,000 NFTs in Lapine and 20,000 NFTs in Canine will be ready to mint/buy and sell.</p>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                    <div className="roadmap__item aos-init" data-aos="fade-left" data-aos-duration="1000">
                        <div className="roadmap__inner">
                            <div className="roadmap__thumb">
                                {/* <img src="http://bored.labartisan.net/assets/images/roadmap/02.png" alt="Roadmap Icon" /> */}
                                <TbParachute fontSize={50} color='#000' className="mb-5"/>
                            </div>
                            <div className="roadmap__content">
                                <h4 className="font-hennypenny font-bold">Airdrops</h4>
                                <p>All the Holders will be Airdroped MATICs in different phases. Early birds will have potential to get 4 times more Airdrops.</p>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                    <div className="roadmap__item aos-init" data-aos="fade-left" data-aos-duration="1000">
                        <div className="roadmap__inner">
                            <div className="roadmap__thumb">
                                {/* <img src="http://bored.labartisan.net/assets/images/roadmap/03.png" alt="Roadmap Icon" /> */}
                                <BiNetworkChart fontSize={50} color='#000' className="mb-5 rotate-45"/>
                            </div>
                            <div className="roadmap__content">
                                <h4 className="font-hennypenny font-bold">Loyalty Reward</h4>
                                <p>The NFTs will help you unlock levels in Loyalty network and you can earn further from your direct and indirect referrals.</p>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                    <div className="roadmap__item aos-init" data-aos="fade-left" data-aos-duration="1000">
                        <div className="roadmap__inner">
                            <div className="roadmap__thumb">
                                {/* <img src="http://bored.labartisan.net/assets/images/roadmap/04.png" alt="Roadmap Icon" /> */}
                                <TbPigMoney fontSize={50} color='#000' className="mb-5"/>
                            </div>
                            <div className="roadmap__content">
                                <h4 className="font-hennypenny font-bold">Platform Reward</h4>
                                <p>The generated Platform Fee will be distributed among the NFT holders based on the Uni level placement.</p>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                    <div className="roadmap__item aos-init" data-aos="fade-left" data-aos-duration="1000">
                        <div className="roadmap__inner">
                            <div className="roadmap__thumb">
                                {/* <img src="http://bored.labartisan.net/assets/images/roadmap/05.png" alt="Roadmap Icon" /> */}
                                <TbMoneybag fontSize={50} color='#000' className="mb-5"/>
                            </div>
                            <div className="roadmap__content">
                                <h4 className="font-hennypenny font-bold">Royalty Reward</h4>
                                <p>The first buyer of any NFT will get 5% Royalty Reward for every resale of that NFT for ever.</p>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                    <div className="roadmap__item aos-init" data-aos="fade-left" data-aos-duration="1000">
                        <div className="roadmap__inner">
                            <div className="roadmap__thumb">
                                <BsBoxSeam fontSize={50} color='#000' className="mb-5"/>
                                {/* <img src="http://bored.labartisan.net/assets/images/roadmap/06.png" alt="Roadmap Icon" /> */}
                            </div>
                            <div className="roadmap__content">
                                <h4 className="font-hennypenny font-bold">Upcoming Collections</h4>
                                <p>All NFT Holders will be able to use their same network to gain uni-level bonuses from upcoming specified collections as well.</p>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Roadmap