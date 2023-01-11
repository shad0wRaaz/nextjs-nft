import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { config } from '../lib/sanityClient'
import { useThemeContext } from '../contexts/ThemeContext'
import Countdown from 'react-countdown'
import { IconHeart, IconImage, IconVideo } from './icons/CustomIcons'
import { BigNumber } from 'ethers'
import { MdAudiotrack } from 'react-icons/md'
import { useAddress } from '@thirdweb-dev/react'

const NFTItem = ({ nftItem }) => {
  const { dark } = useThemeContext()
  const [isLiked, setIsLiked] = useState(false)
  const address = useAddress()
  const [nftData, settNftData] = useState()

  useEffect(() => {
    
    //getting NFT likes and ID of NFT from Sanity
    ;(async (sanityClient = config) => {
      const query = `*[_type == "nftItem" && _id == "${nftItem.asset.properties?.tokenid}"] {
        _id,
        likedBy
      }`
      const res = await sanityClient.fetch(query)
      settNftData(res[0])
      
    })()
  }, [nftItem])

  useEffect(() => {
    setIsLiked(false)
    if(!nftData || !address) return

    if(nftData.likedBy != null){
      const likersArray = nftData.likedBy

      const amILiker = likersArray.find(
        (user) => user._ref == address
      )
      if (amILiker) {
        setIsLiked(true)
      }
    } else {
      setIsLiked(false)
    }
  }, [address])

  return (
    <div
      className={`relative ${
        dark ? ' bg-slate-800' : ' bg-white'
      } group flex flex-col rounded-3xl p-2.5 shadow-md transition hover:shadow-xl`}
    >
      <Link
      href={`/nfts/${nftItem.asset.properties?.tokenid}`}
      >
        <div className="relative flex-shrink-0 cursor-pointer">
          <div className="aspect-w-11 aspect-h-12 relative z-0 flex h-[415px] w-full overflow-hidden rounded-2xl">
            <img
              src={nftItem.asset.image}
              className="rounded-2xl object-cover transition-transform duration-300 ease-in-out will-change-transform hover:scale-[1.03]"
              alt={nftItem.asset.name}
            />
          </div>

          <div className="absolute  bottom-2.5 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white md:h-9 md:w-9">
            {nftItem?.asset?.properties?.itemtype == "audio" ? <MdAudiotrack /> :
            nftItem?.asset?.properties?.itemtype == "video" ? <IconVideo /> : <IconImage />}
          </div>

          <div className="absolute top-2.5 left-2.5 z-10 flex items-center space-x-2">
            <button className="flex !h-9 items-center justify-center rounded-full bg-black/50 px-3.5  text-white">
            <IconHeart color={isLiked ? '#ef4444' : ''} />
              <span className="ml-2 text-sm">
                {nftData?.likedBy?.length ? nftData.likedBy.length : '0'}
              </span>
            </button>

            {/* <div className="hidden md:flex -space-x-1.5">
              <div className="wil-avatar relative flex-shrink-0 inline-flex items-center justify-center text-neutral-100 uppercase font-semibold shadow-inner rounded-full h-5 w-5 text-sm ring-2 ring-white ">
                <img className="absolute inset-0 w-full h-full object-cover rounded-full" src={nftItem.metadata.image} alt="John Doe"/>
                <span className="wil-avatar__name">J</span>
              </div>

              <div className="wil-avatar relative flex-shrink-0 inline-flex items-center justify-center text-neutral-100 uppercase font-semibold shadow-inner rounded-full h-5 w-5 text-sm ring-2 ring-white ">
                <img className="absolute inset-0 w-full h-full object-cover rounded-full" src={nftItem.metadata.image} alt="John Doe"/>
                <span className="wil-avatar__name">J</span>
              </div>

              <div className="wil-avatar relative flex-shrink-0 inline-flex items-center justify-center text-neutral-100 uppercase font-semibold shadow-inner rounded-full h-5 w-5 text-sm ring-2 ring-white ">
                <img className="absolute inset-0 w-full h-full object-cover rounded-full" src={nftItem.metadata.image} alt="John Doe"/>
                <span className="wil-avatar__name">J</span>
              </div>
            </div> */}
          </div>
          {/* {nftItem && nftItem.startTimeInSeconds?.toNumber() != nftItem.secondsUntilEnd?.toNumber() && ( */}
          {/* {nftItem && (parseInt(nftItem.startTimeInSeconds?.hex, 16) != parseInt(nftItem.secondsUntilEnd?.hex, 16)) && (
            <div className="absolute top-[-1px] right-[-1px] flex items-center">
              <svg
                className={`w-44 ${
                  dark ? 'text-slate-800' : 'text-white'
                } md:w-[195px]`}
                viewBox="0 0 196 55"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M196 55V0H0.5V1H4.05286C12.4067 1 20.1595 5.34387 24.5214 12.4685L43.5393 43.5315C47.9012 50.6561 55.654 55 64.0078 55H196Z"
                  fill="currentColor"
                ></path>
              </svg>

              <div className="absolute right-1 top-1/2 -translate-y-1/2 pb-1 text-right">
                <span className="block text-xs tracking-wide text-neutral-500 dark:text-neutral-400">
                  Remaining time
                </span>
                <span className="block font-semibold md:text-lg">
                  {
                    <Countdown
                      date={parseInt(nftItem.secondsUntilEnd?.hex, 16) * 1000}
                    />
                    // <Countdown
                    //   date={nftItem.secondsUntilEnd?.toNumber() * 1000}
                    // />
                  }
                </span>
              </div>
            </div>
          )} */}

          <div className="absolute left-[-1px] bottom-[-0.4px] ">
            <svg
              className={`w-64 ${
                dark ? 'text-slate-800' : 'text-white'
              } md:w-[268px]`}
              width="268"
              viewBox="0 0 281 99"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 0V99H258.059C248.54 99 239.92 93.3743 236.089 84.6606L205.167 14.3394C201.335 5.62568 192.716 0 183.197 0H0Z"
                fill="currentColor"
              ></path>
            </svg>

            <div className="absolute left-4 bottom-0 w-48 ">
              <h2 className="text-left text-sm font-semibold">
                {nftItem.asset.name}
              </h2>

              <div className="mt-1.5 flex w-full items-end justify-between ">
                <div className="pt-3">
                  <div className="relative flex items-baseline rounded-lg border border-green-500 py-1.5 px-2.5 text-sm font-semibold sm:text-base md:py-2 md:px-3.5 ">
                    <span className="absolute bottom-full -mx-1 block translate-y-1 rounded-md bg-green-500 py-0 px-3 text-xs font-normal text-white">
                      Price
                    </span>
                    <span className=" !leading-none text-green-500">
                      {nftItem.buyoutCurrencyValuePerToken.displayValue}{' '}
                      {nftItem.buyoutCurrencyValuePerToken.symbol}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default NFTItem
