import Link from 'next/link'
import "@fontsource/alfa-slab-one";
import React, { Fragment, useState } from 'react'
import { MdOutlineDownloading } from 'react-icons/md'
import { Dialog, Transition } from '@headlessui/react'
import { IconArbitrum, IconAvalanche, IconBNB, IconEthereum, IconPolygon } from '../icons/CustomIcons'

const OtherReferralCommissions = ({ collectionName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const networks = [
        { chainName: 'ethereum', url: '/mushroom-kingdom', icon: <IconEthereum/>, name: 'Mushroom Kingdom'},
        { chainName: 'binance', url: '/rewarding-renditions', icon: <IconBNB/>, name: 'Rewarding Renditions'},
        { chainName: 'polygon', url: '/furry-grace', icon: <IconPolygon/>, name: 'Furry Grace'},
        { chainName: 'ethereum', url: '/etherverse', icon: <IconEthereum/>, name: 'Etherverse'},
        { chainName: 'avalanche', url: '/eminent-creations', icon: <IconAvalanche/>, name: 'Eminent Creations'},
        { chainName: 'arbitrum', url: '/admirable-depictions', icon: <IconArbitrum/>, name: 'Admirable Depictions'},
    ]

  return (
    <>
        {(collectionName != 'mushroom-kingdom' && collectionName != 'rewarding-renditions' && collectionName != 'furry-grace') && 
            <div className="fixed top-0 left-0 w-full h-full bg-slate-800/90 backdrop-blur-xl z-40 flex justify-center items-center">
                <p className="text-2xl md:text-3xl text-center">
                    <MdOutlineDownloading className="inline mr-2" fontSize={40}/>
                    Collection coming soon</p>
            </div>
        }
        <div className="fixed bottom-2 w-full p-2 z-10 flex justify-center alfaslab">
            <div className="bg-[#ffffff88] backdrop-blur-lg rounded-xl text-slate-900 text-normal p-2 px-5 text-xl text-center">
                <p className="text-[0.55rem] leading-3 md:text-xl">One Wallet &#x2022; One Referral Network &#x2022; Earn from 5 Different Chains & 6 Different Collections</p>
                <p className="text-[0.55rem] md:text-xl leading-normal">Buy/Mint NFT from specified collections from any chain, get Loyalty, Royalty and Platform rewards forever.</p>
                <div className="grid-cols-6 mt-3 gap-3 hidden md:grid">
                    {networks.map((net, index) => (
                        <Link href={net.url} key={index}>
                            <div className="text-sm rounded-lg p-2 border-neutral-300/40 border text-center cursor-pointer hover:bg-slate-200/50 transition">
                                {net.icon}{net.name}
                            </div>
                        </Link>
                    ))}
                </div>
                {/* for mobile menu*/}
                <div className="flex items-center md:hidden justify-center z-50 py-2">
                    <button
                    type="button"
                    onClick={()=> setIsOpen(true)}
                    className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                        {/* {currentNetwork.icon}{currentNetwork.name} */}Choose a Collection
                    </button>
                    <Transition appear show={isOpen} as={Fragment}>
                        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                                <div className="fixed inset-0 bg-black bg-opacity-25" />
                            </Transition.Child>

                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden bg-[#ffffff88] backdrop-blur-lg rounded-xl text-slate-900 p-6 text-left align-middle shadow-xl transition-all">
                                        <div className="mt-2">
                                            {networks.map(net => (
                                                <Link href={net.url} key={net.name}>
                                                    <div className="text-sm rounded-lg p-3 border-neutral-300/20 mb-2 border text-center cursor-pointer hover:bg-slate-200/50 transition alfaslab">
                                                        {net.icon}{net.name}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                </div>

            </div>
        </div>
    </>
  )
}

export default OtherReferralCommissions