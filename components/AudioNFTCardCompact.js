
import Link from 'next/link'
import { useState } from 'react'
import { BsFillPlayFill, BsPause } from 'react-icons/bs'
import { useThemeContext } from '../contexts/ThemeContext'

const AudioNFTCardCompact = ({nft}) => {
    const {dark} = useThemeContext();
    const [play, setPlay] = useState(false);
    
  return (
    <div className={`relative flex justify-between p-2 space-x-2 rounded-3xl ${dark ? 'bg-slate-700' : 'bg-white'} hover:shadow-md transition-shadow`}>
        <Link href={`/nfts/${nft.asset.properties?.tokenid}`} passHref>
            <a className="flex-grow flex space-x-4">
                <div className="relative w-16 sm:w-24">
                    <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg">
                        {play && (
                            <audio className="w-full h-full" autoPlay loop>
                                <source src={nft.asset?.animation_url}/>
                                Your browser does not support video tag. Upgrade your browser.
                            </audio>
                        )}
                        <img src={nft.asset.image} className="object-cover w-full h-full" alt="Audio Bars" />
                    </div>
                </div>
                <div className="flex flex-col justify-center flex-grow">
                    <h2 className="block font-medium sm:text-lg">{nft.asset.name}</h2>
                    <div className=" flex items-center pt-3 mt-1.5">
                        <div className="sm:ml-3.5">
                            <div className="flex items-baseline border-2 border-green-500 rounded-lg relative py-1.5 px-2 sm:px-3 text-xs sm:text-sm font-semibold ">
                            <span className="block absolute font-normal bottom-full translate-y-1 p-0.5 px-2 -mx-1 text-xs bg-green-500 text-white rounded-md">Price</span>
                                <span className=" text-green-500 !leading-none">{nft.buyoutCurrencyValuePerToken.displayValue} <span className="text-xs">{nft.buyoutCurrencyValuePerToken.symbol}</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </Link>
        <div className="select-none flex items-center">
            <span 
                className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full ${dark ? 'bg-slate-500' : 'bg-neutral-100'} shadow-lg cursor-pointer`}
                onClick={() => setPlay(curVal => !curVal)}>
                {play ? <BsPause fontSize={25} className={dark ? 'text-white' : 'text-blue-600'} /> : <BsFillPlayFill fontSize={25} className={dark ? 'text-white' : 'text-blue-600'} />}
            </span>
        </div>
    </div>
  )
}

export default AudioNFTCardCompact