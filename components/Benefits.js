import Image from 'next/image';
import { TbStar } from 'react-icons/tb';
import { FaCheck } from 'react-icons/fa';
import { BsInfoCircle } from 'react-icons/bs';
import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react';
import { useThemeContext } from '../contexts/ThemeContext'
import affiliateImg from '../public/assets/affiliate.webp'
import { allbenefits } from '../constants/benefits';

const Benefits = ({nftCollection}) => {
    const { dark } = useThemeContext();
    const [isOpen, setIsOpen] = useState(false);
    const style= {
        card: `rounded-xl ${dark ? 'bg-green-800/50' : 'bg-green-100'}  px-6 py-4 mt-3`,
        cardheader : `flex gap-2 items-center text-md font-bold ${dark ? 'text-green-400' : 'text-green-800'}`,
        cardbody: 'text-sm',
        points: 'py-1',
        bullet: 'inline text-green-500',
        moreinfo: 'flex justify-end mt-4 text-xs',
        moreinfotext: 'text-right py-1 px-3 rounded-md bg-green-700/70 w-fit hover:bg-green-700 cursor-pointer transition',
    }

  return (
    <>
        {allbenefits.filter(benefit => String(benefit.contractAddress).toLowerCase() == String(nftCollection.contractAddress).toLowerCase())?.length > 0 ? (
            <div className={style.card}>
                <div className={style.cardheader}>
                    <TbStar/> Benefits of NFT from {nftCollection.name}
                </div>
                <div className={style.cardbody}>
                    {allbenefits.filter(benefit => String(benefit.contractAddress).toLowerCase() == String(nftCollection.contractAddress).toLowerCase())[0].benefits?.map((point, index) => (
                        <p key={index} className={style.points}><FaCheck className={style.bullet} fontSize={15}/> {point.content}</p>
                    ))}
                    <div className={style.moreinfo}>
                        <p className={style.moreinfotext} onClick={() => setIsOpen(true)}><BsInfoCircle className="inline" /> What is our Loyalty Reward?</p>
                    </div>
                </div>
            </div>
        ) : ''}
        <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl max-h-[700px] transform overflow-auto rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg text-center font-medium leading-6 text-gray-900"
                  >
                    NUVA NFT's Loyalty Reward System
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                        <Image src={affiliateImg} className="w-full h-auto"/>
                      Nuva NFT is proud to present its 5 level Loyalty Reward System. The main idea of this system is to build a NFT community within the Nuva NFT Ecosystem. Once you are connect your wallet, you will receive a unique link in your profile, using which you can send invitations.
                      You can invite your friends and family and get benefitted altogether. 
                    </p>
                    <p className="text-sm text-gray-500 mt-3">
                      <b>Level 1:</b> If you invite anyone and once they buy an NFT from one of eligible NFT Collections, you will be rewarded <b>10%</b> of the bought NFT's price straightaway. They will be your Level 1 Referrals.
                    </p>
                    <p className="text-sm text-gray-500 mt-3">
                      <b>Level 2:</b> If your referral invites other people like you did, the new members will be your Level 2 Referrals. If your Level 2 referral makes a NFT purchase, you will be rewarded <b>8%</b> of the bought NFT's price.*
                    </p>
                    <p className="text-sm text-gray-500 mt-3">
                      <b>Level 3:</b> You will be rewarded <b>6%</b> of the bought NFT's price, if anyone from your Level 2's referral buys an NFT.*
                    </p>
                    <p className="text-sm text-gray-500 mt-3">
                      <b>Level 4:</b> You will be rewarded <b>5%</b> of the bought NFT's price, if anyone from your Level 3's referral buys an NFT.*
                    </p>
                    <p className="text-sm text-gray-500 mt-3">
                      <b>Level 5:</b> You will be rewarded <b>5%</b> of the bought NFT's price, if anyone from your Level 4's referral buys an NFT.*
                    </p>
                    
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default Benefits