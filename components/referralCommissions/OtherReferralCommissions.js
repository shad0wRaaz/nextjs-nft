import Link from 'next/link'
import React from 'react'
import { IconAvalanche, IconBNB, IconEthereum, IconPolygon } from '../icons/CustomIcons'

const OtherReferralCommissions = ({ currentChain }) => {
  return (
    <div className="fixed bottom-2 w-full p-2 z-50 flex justify-center">
        <div className="bg-[#ffffff88] backdrop-blur-lg rounded-xl text-slate-900 text-normal p-2 px-5 text-xl text-center">
            One Wallet &#x2022; One Referral Network &#x2022; Earn from 4 Different Chains
            <div className="grid grid-cols-4 mt-3 gap-3">
                <Link href="/majestic-visions">
                    <div className="text-sm rounded-lg p-2 border-neutral-300/40 border text-center cursor-pointer hover:bg-slate-200/50 transition">
                        <IconEthereum/>Ethereum (ETH)
                    </div>
                </Link>
                <Link href="/rewarding-renditions">
                    <div className="text-sm rounded-lg p-2 border-neutral-300/40 border text-center cursor-pointer hover:bg-slate-200/50 transition">
                        <IconBNB/> Binance (BNB)
                    </div>
                </Link>
                <Link href="/admirable-depictions">
                    <div className="text-sm rounded-lg p-2 border-neutral-300/40 border text-center cursor-pointer hover:bg-slate-200/50 transition">
                        <IconPolygon /> Polygon (MATIC)
                    </div>
                </Link>
                <Link href="/eminent-creations">
                    <div className="text-sm rounded-lg p-2 border-neutral-300/40 border text-center cursor-pointer hover:bg-slate-200/50 transition">
                        <IconAvalanche/>Avalanche (AVAX)
                    </div>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default OtherReferralCommissions