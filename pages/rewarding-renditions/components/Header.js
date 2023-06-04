import Image from 'next/image';
import "@fontsource/alfa-slab-one";
import { CgMenu } from 'react-icons/cg'
import { config } from '../../../lib/sanityClient'
import nuvanftLogo from '../../../assets/nuvanft.png'
import React, { useEffect, useRef, useState } from 'react'
import { ConnectWallet, useAddress } from '@thirdweb-dev/react';

const Header = ({setShowMenu, showMenu}) => {
    const menuRef = useRef();
    const address = useAddress();
    const refs = [
        '0xa80bc68E1Af4201Ea84Dd83b87793D11B42a73e4',
        '0xB753F953A3D9843902448926db8a2E0Ec6a8273a',
        '0x8B7c1F7445e8f8fC67c3d880d0FDA07df0faAE9B',
        '0xC2f870e2Cb3Bda7CC4864aD195394b4A2Ad711E7',
        '0x792fdC3c8DBE740A3810d8291C3623A85F0dcEC9',
        '0x0a13a7996870cDD480B68a8c2135C6635f28aA35',
        '0x9cB0b5Ba3873b4E4860A8469d66998059Af79eA6',
        '0xC3e76653D5A9eE8Ab36FcD51964c2D4522c8e58E',
        '0xf0D6D62b7292087a229Cb487D081784C63B45194',
    ]
    const getWalletRefForToday = () => {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const index = dayOfYear % refs.length;
        return refs[index];
    }
    useEffect(() => {
        if (!address) {
        //   setIsLogged(false);
        //   setIsAdmin(false);
        //   setMyUser();
          return
        }
        ;(async () => {
            const userDoc = {
                _type: 'users',
                _id: address,
                userName: 'Unnamed',
                walletAddress: address,
                volumeTraded: 0,
                verified: false,
                refactivation: true,
                tokensent: false,
                payablelevel: 1,
                referrer: {
                    _type: 'reference',
                    _ref: getWalletRefForToday(),
                }
          }
    
          //saves new user if not present otherwise returns the user data
          const user = await config.createIfNotExists(userDoc);
        //   setMyUser(user);
        //   setIsLogged(true);
        })();
      
        return() => {
            //do nothing//clean up function
    
        }
      }, [address])
    

  return (
    <header className="header bg-[#23162c00] backdrop-blur-lg alphaslab text-neutral-100 fixed z-50 w-full" style={{ fontFamily: 'Alfa Slab One'}}>
        <div className="container md:w-[1140px] mx-auto px-8">
            <nav className="navbar navbar-expand-xl flex !justify-between">
                <a className="navbar-brand w-fit" href="/">
                    <Image src={nuvanftLogo} alt="Rewarding Renditions" height="80px" width="150px" objectFit='contain'/>
                </a>
                <button 
                    className="navbar-toggler md:hidden" 
                    type="button"
                    onClick={() => setShowMenu(cur => !cur)}>
                   <CgMenu fontSize={25}/>
                </button>
                <div ref={menuRef} className={`md:flex ${!showMenu && 'hidden'} justify-end items-center flex-wrap flex-col w-full md:flex-row`} id="">
                    <div className="navbar-nav">
                        <a className="nav-link text-center" aria-current="page" href="#home">Home</a>
                        <a className="nav-link text-center" href="#collection">NFT</a>
                        <a className="nav-link text-center" href="#buy">Buy</a>
                        <a className="nav-link text-center" href="#roadmap">Roadmap</a>
                        <a className="nav-link text-center" href="#faq">Faq</a>
                    </div>
                    <div className="social-btns  text-center md:ml-5">
                        <ConnectWallet accentColor="#0053f2" colorMode="light" className="default-btn" />
                        {/* <a href="#" className="default-btn">
                            <span>Connect Wallet</span>
                        </a> */}
                    </div>
                </div>
            </nav>
        </div>
    </header>
  )
}

export default Header