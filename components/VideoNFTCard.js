import Link from 'next/link'
import { config } from '../lib/sanityClient'
import { IconWallet } from './icons/CustomIcons'
import React, { useState, useEffect } from 'react'
import { BsFillPlayFill, BsPause } from 'react-icons/bs'
import { useThemeContext } from '../contexts/ThemeContext'

const VideoNFTCard = ({nft}) => {
    const { dark } = useThemeContext();
    const [play, setPlay] = useState(false);
    // const [likers, setLikers] = useState([]);

    // useEffect(() => {
    //     if(!nft) return
    //     ;(async(sanityClient = config) => {
    //         const query = `*[_type == "nftItem" && contractAddress == "${nft.assetContractAddress}" && id=="${parseInt(nft.asset.id?.hex, 16)}"]{likedBy[]->}`
    //         const res = await sanityClient.fetch(query)
    //         setLikers(res[0]?.likedBy)
    //     })();

    //     return() => {
    //         //do nothing
    //     }
    // }, [nft])
    
  return (
    <div className={`relative flex max-w-md flex-col group shadow-md p-2 rounded-3xl mr-6 ${dark ? 'bg-slate-700' : ' bg-neutral-200'}`}>
        <div className="relative flex-shrink-0 rounded-3xl overflow-hidden">
            <div className="">
                <div className="flex aspect-video z-0">
                    {play && (
                        <video className="w-full h-full" autoPlay loop>
                            <source src={nft.asset?.animation_url}/>
                            Your browser does not support video tag. Upgrade your browser.
                        </video>
                    )}
                    {!play && (
                        <img src={nft.asset.image} className="object-cover w-full h-full group-hover:scale-[1.03] rounded-3xl overflow-hidden transition-transform duration-300 ease-in-out" alt={nft.asset.name}/>
                    )}
                </div>
            </div>
            {!play && (
                <button className="bg-black/50 px-3.5 flex items-center justify-center rounded-full text-white absolute top-3 right-3 z-10 !h-9">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z" stroke="currentColor" fill="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    <span className="ml-2 text-sm">{nft?.likedBy == null ? '0' : nft?.likedBy }</span>
                </button>
            )}
            <div className="nc-ButtonPlayMusicRunningContainer select-none absolute bottom-3 left-3 z-10">
                <div 
                    className={`w-14 h-14 flex items-center justify-center rounded-full ${dark ? 'bg-slate-500' : 'bg-neutral-100'} cursor-pointer`}
                    onClick={() => setPlay(curVal => !curVal)}>
                    {play ? <BsPause fontSize={30} className={dark ? 'text-white' : 'text-blue-600'} /> : <BsFillPlayFill fontSize={30} className={dark ? 'text-white' : 'text-blue-600'} />}
                </div>
            </div>
        </div>
        <div className="p-5">
            <div className="flex justify-between items-center">
                <h2 className="sm:text-lg font-semibold">{nft.asset.name}</h2>
            </div>
            <div className="flex justify-between items-center mt-3.5 flex-wrap">
                <div className="pt-3">
                    <div className="flex items-baseline border-2 border-green-500 rounded-lg relative py-1.5 md:py-2 px-2.5 md:px-3.5 text-sm sm:text-base font-semibold ">
                        <span className="block absolute font-normal bottom-full translate-y-1 p-0.5 px-2 -mx-1 text-xs bg-green-500 text-white rounded-md">Price</span>
                        <span className="text-green-500 !leading-none">{nft.buyoutCurrencyValuePerToken.displayValue} <span className="text-xs">{nft.buyoutCurrencyValuePerToken.symbol}</span></span>
                    </div>
                </div>
                <div className="pt-3">
                    <div className="text-sm rounded-xl inline-flex cursor-pointer gradBlue py-3 px-4 text-neutral-100 max-w-fit m-sm-auto items-center">
                        <IconWallet/> <span className="pl-2">Buy Now</span>
                    </div>
                </div>
            </div>
        </div>
        <Link href={`/nfts/${nft?.asset.properties.tokenid}`} passHref>
            <a className="absolute inset-0 shadow-md" draggable="true"></a>
        </Link>
    </div>
  )
}

export default VideoNFTCard