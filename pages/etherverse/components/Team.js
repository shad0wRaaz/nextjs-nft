import React from 'react'

const Team = () => {
  return (
    <section id="team" className="team alfaslab py-[70px] md:py-[100px] bg-fixed" style={{backgroundImage: `url(http://bored.labartisan.net/assets/images/team/bg.jpg)`}}>
        <div className="container mx-auto p-8">
            <div className="section-header aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000">
                <div className="section-header__content  text-center w-full max-w-[1000px] mx-auto">
                    <h2 className="text--3d text-4xl md:text-[4.5rem] leading-normal"> <span className="color--gradient-y d-block"> Meet</span> Our Team</h2>
                    <p>Some teams call themselves a family, but we actually are one! all designers with a passion for art</p>
                </div>
            </div>
            <div className="team__wrapper container mx-auto mt-[3rem]">
                <div className="flex justify-center flex-wrap gap-5">
                    <div className="col">
                    <div className="team__item aos-init" data-aos="flip-right" data-aos-duration="1000">
                        <div className="team__inner">
                            <div className="team__thumb hover:rotate-[30deg] transition"><img src="http://bored.labartisan.net/assets/images/team/01.png" alt="team Image" /></div>
                            <div className="team__content">
                                <h5><a href="#">Johann Row</a></h5>
                                <p>UI/UX Designer</p>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="col">
                    <div className="team__item aos-init" data-aos="flip-right" data-aos-duration="1000">
                        <div className="team__inner">
                            <div className="team__thumb hover:rotate-[30deg] transition"><img src="http://bored.labartisan.net/assets/images/team/02.png" alt="team Image" /></div>
                            <div className="team__content">
                                <h5><a href="#">Robinor Uep</a></h5>
                                <p>NFT Marketer</p>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="col">
                    <div className="team__item aos-init" data-aos="flip-right" data-aos-duration="1000">
                        <div className="team__inner">
                            <div className="team__thumb hover:rotate-[30deg] transition"><img src="http://bored.labartisan.net/assets/images/team/03.png" alt="team Image" /></div>
                            <div className="team__content">
                                <h5><a href="#">jhon Doe</a></h5>
                                <p>The Developer</p>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="col">
                    <div className="team__item aos-init" data-aos="flip-right" data-aos-duration="1000">
                        <div className="team__inner">
                            <div className="team__thumb hover:rotate-[30deg] transition"><img src="http://bored.labartisan.net/assets/images/team/04.png" alt="team Image" /></div>
                            <div className="team__content">
                                <h5><a href="#">Sammlie tom</a></h5>
                                <p>3d Artist</p>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="col">
                    <div className="team__item aos-init" data-aos="flip-right" data-aos-duration="1000">
                        <div className="team__inner">
                            <div className="team__thumb hover:rotate-[30deg] transition"><img src="http://bored.labartisan.net/assets/images/team/05.png" alt="team Image" /></div>
                            <div className="team__content">
                                <h5><a href="#">Emanuel Elp</a></h5>
                                <p>CTO</p>
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

export default Team