import React, { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import Buy from './components/Buy'
import Roadmap from './components/Roadmap'
import Team from './components/Team'
import Faq from './components/Faq'
import Community from './components/Community'
import Footer from './components/Footer'

const index = () => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <main className="rewardingrenditions">
        {/* http://bored.labartisan.net/index-single# */}
        <Header showMenu={showMenu} setShowMenu={setShowMenu} />
        <Hero setShowMenu={setShowMenu}/>
        <Gallery setShowMenu={setShowMenu}/>
        <Buy setShowMenu={setShowMenu}/>
        <Roadmap setShowMenu={setShowMenu}/>
        <Community setShowMenu={setShowMenu}/>
        {/* <Team/> */}
        <Faq setShowMenu={setShowMenu}/>
        <Footer setShowMenu={setShowMenu}/>
    </main>
  )
}

export default index