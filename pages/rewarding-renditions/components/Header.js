import Image from 'next/image';
import "@fontsource/alfa-slab-one";
import { CgMenu } from 'react-icons/cg'
import { config } from '../../../lib/sanityClient'
import nuvanftLogo from '../../../assets/nuvanft.png'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { ConnectWallet, useAddress } from '@thirdweb-dev/react';
import { Dialog, Transition } from '@headlessui/react';
import { MdOutlineClose } from 'react-icons/md';
import { useSettingsContext } from '../../../contexts/SettingsContext';

const Header = ({setShowMenu, showMenu}) => {
    const menuRef = useRef();
    const address = useAddress();
    const [showAbout, setShowAbout] = useState(false);
    const { refs } = useSettingsContext();
    
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
        <div className="container mx-auto px-8">
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
                        <a className="nav-link text-center" aria-current="page" href="#home" onClick={() => setShowMenu(false)}>Home</a>
                        <a className="nav-link text-center" aria-current="page" href="#" onClick={() => {setShowAbout(true); setShowMenu(false)}}>About</a>
                        <a className="nav-link text-center" href="#collection" onClick={() => setShowMenu(false)}>NFT</a>
                        <a className="nav-link text-center" href="#buy" onClick={() => setShowMenu(false)}>Buy</a>
                        <a className="nav-link text-center" href="/rewardingrenditions/WhitePaper.pdf" target="_blank">Whitepaper</a>
                        <a className="nav-link text-center" href="#roadmap" onClick={() => setShowMenu(false)}>Roadmap</a>
                        <a className="nav-link text-center" href="#videos" onClick={() => setShowMenu(false)}>Videos</a>
                        <a className="nav-link text-center" href="#faq" onClick={() => setShowMenu(false)}>Faq</a>
                    </div>
                    <div className="social-btns  text-center md:ml-5">
                        <ConnectWallet accentColor="#0053f2" colorMode="light" className="" />
                        {/* <a href="#" className="default-btn">
                            <span>Connect Wallet</span>
                        </a> */}
                    </div>
                </div>
            </nav>
        </div>
        <Transition appear show={showAbout} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setShowAbout(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex h-full w-full items-center justify-center p-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="alfaslab h-[500px] md:h-fit relative top-[3rem] max-w-4xl transform overflow-scroll md:overflow-hidden rounded-2xl bg-[#ffffffbb] backdrop-blur-lg p-[3rem] text-left align-middle shadow-xl transition-all">
                            <Dialog.Title
                                as="h3"
                                className="text-md font-medium leading-6 text-gray-900 text-center"
                            >
                                {/* <span className="font-bold">CRYPTO CREATURES</span> */}
                            </Dialog.Title>
                            <div 
                                className="absolute cursor-pointer right-2 top-2 flex items-center justify-center bg-red-500 text-neutral-100 p-2 rounded-lg    " 
                                onClick={() => setShowAbout(false)}
                                >
                                    <MdOutlineClose />
                                </div>
                            <div className="text-slate-800 text-xl">
                                <p className="mb-4">THE TIME IS NOW<br/>Break free from the norm and take control of your future. On June 30th 2023, the world's first-ever referral and recurring income opportunity is launching with the Rewarding Renditions Nuva NFT collections! Take action today for paydays from the 30th of June; all payments will be in BNB.</p>
                                <p className="mb-4">This is your time, your opportunity to get in on the ground floor and take advantage of the optimum timing. It's simple; you only need to register your wallet on the Nuva NFT site and ensure you have BNB to purchase your own NFTs and enjoy the benefits.  All of this without the need for registration or KYC!</p>
                                <p className="mb-4">Simply connect with like-minded individuals and influencers since this is just the start. The BNB program is merely the beginning, as you will be able to earn with the same network with four different programs!</p>
                                <p className="mb-4">The time is now! Don't wait, don't hesitate, take advantage of this enormous opportunity to change your life. Join the revolution, register today, and get ready to reap the benefits of Referral and Recurring Income with Rewarding Renditions Nuva NFT collections - And yes, it's a DeFi. And yes, it's ONLY on nuvanft.io. <br/> <br/>Launching on 30th June, 2023.<br/>This is YOUR time. Are you ready?</p>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    </header>
  )
}

export default Header