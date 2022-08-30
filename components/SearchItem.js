import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { config } from '../lib/sanityClient'
import { useThemeContext } from '../contexts/ThemeContext'
import { IconHeart, IconImage, IconVideo } from './icons/CustomIcons'
import { BigNumber } from 'ethers'
import { RiTimerLine } from 'react-icons/ri'
import { MdAudiotrack } from 'react-icons/md'

const SearchItem = ({ nftItem }) => {
  const [likers, setLikers] = useState([])
  const { dark } = useThemeContext()
 
  useEffect(() => {
    //getting NFT likes from Sanity
    if(!nftItem) return
    ;(async (sanityClient = config) => {
      const query = `*[_type == "nftItem" && contractAddress == "${
        nftItem.assetContractAddress
      }" && id == "${BigNumber.from(nftItem.asset.id).toNumber()}"] {
            likedBy
          }`
      const res = await sanityClient.fetch(query)
      setLikers(res[0])
    })()
  }, [nftItem])
  
  return (
    <div className={`group relative flex flex-col !border-0 shadow-sm rounded-3xl ${dark ? 'bg-slate-700': 'bg-white'}`}>
      {!nftItem && (
        <div className="flex w-full h-full justify-center items-center">Not Available</div>)}
      {nftItem && (
        <a
          href={`/nfts/${BigNumber.from(nftItem.asset.id).toNumber()}?c=${nftItem.assetContractAddress}`}
        >
          <div>
            <div className="relative flex-shrink-0 ">
              <div>
                <div
                  className="aspect-w-11 aspect-h-12 z-0 flex h-[300px] w-full cursor-pointer overflow-hidden rounded-3xl">
                  <img
                    src={nftItem.asset.image}
                    className="h-full w-full object-cover transition-transform duration-300 ease-in-out will-change-transform group-hover:scale-[1.03]"
                    alt={nftItem.asset.name}
                  />
                </div>
              </div>

              <div className="absolute top-3 left-3 flex !h-9 !w-9 items-center justify-center rounded-full bg-black/50 text-white">
                {nftItem.asset.properties.itemtype == "video" ? <IconVideo /> : nftItem.asset.properties.itemtype == "audio" ? <MdAudiotrack /> : <IconImage />}
              </div>

              <button className="absolute top-3 right-3 z-10 flex h-10 !h-9 items-center justify-center rounded-full bg-black/50 px-3.5 text-white">
                <IconHeart />
                <span className="ml-2 text-sm">
                  {likers?.likedBy?.length ? likers.likedBy.length : '0'}
                </span>
              </button>

              <div className="absolute inset-x-3 top-3 flex"></div>
            </div>

            <div className="space-y-3 p-8 py-5">
              <h2 className="text-lg font-medium">{nftItem.asset.name}</h2>

              {/* <div className={`w-full border-b ${dark ? 'border-sky-700/30' : 'border-neutral-100'}`}></div> */}

              <div className="flex border-t border-neutral-100 pt-4 items-end justify-between ">
                <div className="pt-3">
                  <div className="relative flex items-baseline rounded-lg border-2 border-green-500 py-1.5 px-2.5 text-sm font-semibold sm:text-base md:py-2 md:px-3.5 ">
                    <span className={`absolute bottom-full -mx-1 block rounded-md translate-y-1 p-1 px-3 bg-green-500 text-xs font-normal text-neutral-100`}>
                      Price
                    </span>

                    <span className=" !leading-none text-green-500">
                      {nftItem.buyoutCurrencyValuePerToken.displayValue}{' '}
                      {nftItem.buyoutCurrencyValuePerToken.symbol}
                    </span>
                  </div>
                </div>

                <div className={`flex items-center text-right text-sm ${dark ? 'text-slate-500': 'text-neutral-500'}`}>
                  <span className={`ml-1 mt-0.5 text-[0.8rem] ${dark ? 'text-slate-400': 'text-neutral-500'}`}>
                    <RiTimerLine className={dark ? 'text-slate-400 inline' : 'text-neutral-500 inline'}/> 17h left
                  </span>
                </div>
              </div>
            </div>
          </div>
        </a>
      )}
    </div>
  )
}

export default SearchItem

