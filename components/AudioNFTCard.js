import { useState } from 'react'
import { BsFillPlayFill, BsPause } from 'react-icons/bs'
import { useThemeContext } from '../contexts/ThemeContext'
import { IconWallet } from './icons/CustomIcons';


const AudioNFTCard = ({nft}) => {
    const { dark } = useThemeContext();
    const [play, setPlay] = useState(false);
    
  return (
    <div className="relative group sm:col-span-3 xl:col-span-2 cursor-pointer">
        <div className="rounded-3xl overflow-hidden">
            <div className="block aspect-w-12 relative aspect-h-10 w-full h-[340px] rounded-3xl overflow-hidden z-0">
                {play && (
                    <audio className="w-full h-full" autoPlay loop>
                        <source src={nft.asset?.animation_url}/>
                        Your browser does not support video tag. Upgrade your browser.
                    </audio>
                )}
                <a href={`/nfts/${nft.asset.properties?.tokenid}`}>
                    <img src={nft.asset.image} className="object-cover w-full h-full group-hover:scale-[1.03] rounded-3xl transition-transform duration-300 ease-in-out" alt=""/>
                </a>
            </div>
        </div>
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center space-x-2">
            <button className="bg-black/50 px-3.5 h-10 flex items-center justify-center rounded-full text-white !h-9">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span className="ml-2 text-sm">{nft.likedBy }</span>
            </button>
        </div>
        <div className="absolute top-[-1px] right-[-1px] flex items-center hidden">
            <svg className="w-44 md:w-[195px]" viewBox="0 0 196 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M196 55V0H0.5V1H4.05286C12.4067 1 20.1595 5.34387 24.5214 12.4685L43.5393 43.5315C47.9012 50.6561 55.654 55 64.0078 55H196Z" fill="currentColor"></path>
            </svg>
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
                <span className="block text-xs tracking-wide">Remaining time</span>
                <span className="block md:text-lg font-semibold">3h : 15m : 20s</span>
            </div>
        </div>
        <div className="w-11/12 max-w-[360px] transform -mt-32 relative z-10">
            <div className="px-5 flex items-center space-x-4 relative ">
                <div className="flex-grow flex justify-center">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMkAAAAdCAYAAAAAaUg8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADZSURBVHgB7drLDoIwFEXRhi/XL6+PCTNPSS8gYa2pid2TkyKxtUm990e7AJ21dG7wjujtAnTWulPn0oCfjAQCI4EgjmT2h89RP5x01tK57Uv6np9X0VlL58rjFgTL2e+RR8/XOUZnre/5e19XVdeyzprP/6XjSp0etyAwEgiMBAIjgcBIIDASCIwEAiOBwEggMBIIPiN5tnONnq+z9nydVecf9R+dWTpr6Vx53IJgZCSz191R16XOWjqrHHWtztJZ606dHrcgMBIIjASCipGc/R57lM5at+l8Ab6JZwjCaizRAAAAAElFTkSuQmCC" alt="Music Wave" />
                </div>
                <div className="select-none relative z-10">
                    <div 
                        className={`w-14 h-14 flex items-center justify-center rounded-full ${dark ? 'bg-slate-500' : 'bg-neutral-100'} cursor-pointer`}
                        onClick={() => setPlay(curVal => !curVal)}>
                        {play ? <BsPause fontSize={30} className={dark ? 'text-white' : 'text-blue-600'} /> : <BsFillPlayFill fontSize={30} className={dark ? 'text-white' : 'text-blue-600'} />}
                    </div>
                </div>
            </div>
            
            <a 
            className={`block p-5 mt-5 ${dark ? 'bg-slate-700' : 'bg-white'} shadow-xl rounded-3xl rounded-tl-none`}
            href={`/nfts/${nft.asset.properties?.tokenid}`}>
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{nft.asset.name}</h2>
                    {/* <div className="flex -space-x-1.5 hover:-space-x-0.5 transition duration-300">
                        {likersProfile && likersProfile?.map((likers) => (
                            <div className="wil-avatar relative flex-shrink-0 inline-flex items-center justify-center text-neutral-100 uppercase font-semibold shadow-inner rounded-full h-5 w-5 text-sm ring-2 ring-white dark:ring-neutral-800">
                                <img className="absolute inset-0 w-full h-full object-cover rounded-full" src={likers?.data?.url} alt="NFT Likers" />
                                <span className="wil-avatar__name">J</span>
                            </div>
                        ))}
                    </div> */}
                </div>
                <div className="w-full mt-1.5 flex justify-between items-center ">
                    <div className="pt-3">
                        <div className="flex items-baseline border-2 border-green-500 rounded-lg relative py-1.5 md:py-2 px-2.5 md:px-3.5 text-sm sm:text-base font-semibold ">
                        <span className="block absolute font-normal bottom-full translate-y-1 p-0.5 px-2 -mx-1 text-xs bg-green-500 text-white rounded-md">Price</span>
                            <span className=" text-green-500 !leading-none">{nft.buyoutCurrencyValuePerToken.displayValue} {nft.buyoutCurrencyValuePerToken.symbol}</span>
                        </div>
                    </div>
                    <div className="pt-3">
                    <div className="text-sm rounded-xl inline-flex cursor-pointer gradBlue py-3 px-4 text-neutral-100 max-w-fit m-sm-auto items-center">
                        <IconWallet /> <span className="pl-2">Buy Now</span>
                    </div>
                </div>
                </div>
            </a>
        </div>
    </div>
  )
}

export default AudioNFTCard