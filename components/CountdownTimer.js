import React from 'react';
import { CgSandClock } from 'react-icons/cg'
import { useCountdown } from '../hooks/useCountdown'
import { IconAvalanche, IconBNB, IconEthereum, IconPolygon } from './icons/CustomIcons';
import Link from 'next/link';
import { FaAngellist } from 'react-icons/fa';

export const CountdownTimer = ({ targetDate, align }) => {
  const style = { 
    button : `rounded-full p-2 px-3 text-sm text-center cursor-pointer hover:ring-0 transition hover:ring-white/40 hover:shadow-md outline-0 hover:scale-105`
  }
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  if (days + hours + minutes + seconds <= 0) {
   return (
    <div className="mt-4 mb-4">
      <p className="text-4xl mb-3 font-bold textGradGreen animate-bounce">
        <a href="#rewardingrenditions">
          Sale ongoing NOW !!!
        </a>
      </p>
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pb-[1rem] md:pb-0">
        <Link href="/majestic-visions">
          <div className={style.button + ' bg-slate-600/50 hover:bg-slate-600/70'}>
            <IconEthereum/>Ethereum
          </div>
        </Link>
        <Link href="/rewarding-renditions">
          <div className={style.button + ' bg-yellow-600/50 hover:bg-yellow-600/70'}>
            <IconBNB/>Binance
          </div>
        </Link>
        <Link href="/admirable-depictions">
          <div className={style.button + ' bg-purple-600/50 hover:bg-purple-600/70'}>
            <IconPolygon/>Polygon
          </div>
        </Link>
        <Link href="/eminent-creations">
          <div className={style.button + ' bg-pink-600/50 hover:bg-pink-600/70'}>
            <IconAvalanche/>Avalanche
          </div>
        </Link>
      </div> */}
      <p className="mt-4 flex gap-1">👑 One Wallet - one referral network and earn recurring income on FOUR chains</p>
      <p className="mt-1 gap-1 flex">👑 No purchase necessary to earn from direct referrals.</p>
      <p className="mt-1 gap-1 flex ">👑 Calling all NFT enthusiasts and influencers - connect your wallet, share your link, and let's take the crypto world by storm together!</p>
    </div>
   )
  }

    return (
          <div className={`flex space-x-5 sm:space-x-10 justify-${align} py-5`}>
            <div className="flex flex-col text-center">
              <span className="text-2xl sm:text-2xl font-semibold">{days}</span>
              <span className="sm:text-lg text-neutral-300">Days</span>
            </div>
            
            <div className="flex flex-col text-center">
              <span className="text-2xl sm:text-2xl font-semibold">{hours}</span>
              <span className="sm:text-lg text-neutral-300">hours</span>
            </div>
            
            <div className="flex flex-col text-center">
              <span className="text-2xl sm:text-2xl font-semibold">{minutes}</span>
              <span className="sm:text-lg text-neutral-300">minutes</span>
            </div>
            
            <div className="flex flex-col text-center">
              <span className="text-2xl sm:text-2xl font-semibold">{seconds}</span>
              <span className="sm:text-lg text-neutral-300">seconds</span>
            </div>
          </div>
    )
};